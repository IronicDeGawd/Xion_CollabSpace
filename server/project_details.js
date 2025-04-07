const express = require("express");
const router = express.Router();
const sql = require("./db");
const auth = require("./middleware/auth");

// Create or update project details after on-chain creation
router.post("/", auth, async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      skills_required,
      repository_url,
      website_url,
      status,
    } = req.body;

    // Check if project already exists
    const existingProject = await sql`
      SELECT * FROM project_details WHERE project_id = ${project_id}
    `;

    if (existingProject.length > 0) {
      // Update existing project
      const updatedProject = await sql`
        UPDATE project_details
        SET
          title = ${title},
          description = ${description},
          skills_required = ${skills_required},
          repository_url = ${repository_url},
          website_url = ${website_url},
          status = ${status},
          updated_at = CURRENT_TIMESTAMP
        WHERE project_id = ${project_id} AND owner_address = ${req.user.address}
        RETURNING *
      `;

      if (updatedProject.length === 0) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this project" });
      }

      return res.json(updatedProject[0]);
    } else {
      // Create new project details
      const newProject = await sql`
        INSERT INTO project_details
        (project_id, owner_address, title, description, skills_required, repository_url, website_url, status)
        VALUES
        (${project_id}, ${
        req.user.address
      }, ${title}, ${description}, ${skills_required}, ${repository_url}, ${website_url}, ${
        status || "Open"
      })
        RETURNING *
      `;

      return res.status(201).json(newProject[0]);
    }
  } catch (error) {
    console.error("Error handling project details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all projects with details (including collaboration info for the authenticated user)
router.get("/", async (req, res) => {
  try {
    const projects = await sql`
      SELECT pd.*,
             u.name as owner_name,
             up.image_url as owner_image,
             (SELECT COUNT(*) FROM project_collaborators WHERE project_id = pd.project_id AND status = 'Approved') as collaborator_count
      FROM project_details pd
      LEFT JOIN users u ON pd.owner_address = u.address
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY pd.created_at DESC
    `;

    // Make sure to handle any null values that might cause issues
    const cleanedProjects = projects.map((project) => ({
      ...project,
      owner_name: project.owner_name || "Unknown User",
      skills_required: Array.isArray(project.skills_required)
        ? project.skills_required
        : [],
      collaborator_count: parseInt(project.collaborator_count || "0", 10),
    }));

    res.json(cleanedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get projects for a specific user (owned + collaborating)
router.get("/user/:address", async (req, res) => {
  try {
    const address = req.params.address;

    // Get user ID
    const userResult =
      await sql`SELECT id FROM users WHERE address = ${address}`;

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult[0].id;

    // Get owned projects
    const ownedProjects = await sql`
      SELECT pd.*, 'owner' as role
      FROM project_details pd
      WHERE pd.owner_address = ${address}
    `;

    // Get collaborating projects
    const collaboratingProjects = await sql`
      SELECT pd.*, pc.role, pc.status as collaboration_status
      FROM project_details pd
      JOIN project_collaborators pc ON pd.project_id = pc.project_id
      WHERE pc.user_id = ${userId}
    `;

    res.json({
      owned: ownedProjects,
      collaborating: collaboratingProjects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get project details by project_id
router.get("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log("Looking up project with ID:", projectId, typeof projectId);

    const project = await sql`
      SELECT pd.*,
             u.name as owner_name,
             up.image_url as owner_image
      FROM project_details pd
      LEFT JOIN users u ON pd.owner_address = u.address
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE pd.project_id = ${projectId}
    `;

    if (project.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get collaborators - update this to join with user_profiles as well
    const collaborators = await sql`
      SELECT pc.*,
             u.name,
             up.image_url
      FROM project_collaborators pc
      JOIN users u ON pc.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE pc.project_id = ${projectId}
    `;

    res.json({
      ...project[0],
      collaborators: collaborators || [],
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update project status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const projectId = req.params.id;

    // Verify project ownership
    const project = await sql`
      SELECT * FROM project_details WHERE project_id = ${projectId} AND owner_address = ${req.user.address}
    `;

    if (project.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this project" });
    }

    // Update status
    const updatedProject = await sql`
      UPDATE project_details
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = ${projectId}
      RETURNING *
    `;

    res.json(updatedProject[0]);
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Request to join a project
router.post("/:id/collaborate", auth, async (req, res) => {
  try {
    const { role } = req.body;
    const projectId = req.params.id;

    // Check if the project exists
    const project = await sql`
      SELECT * FROM project_details WHERE project_id = ${projectId}
    `;

    if (project.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Prevent owner from requesting collaboration
    if (project[0].owner_address === req.user.address) {
      return res
        .status(400)
        .json({ error: "You are the owner of this project" });
    }

    // Check if already requested
    const existingRequest = await sql`
      SELECT * FROM project_collaborators pc
      JOIN users u ON pc.user_id = u.id
      WHERE pc.project_id = ${projectId} AND u.address = ${req.user.address}
    `;

    if (existingRequest.length > 0) {
      return res.status(400).json({
        error: "You have already requested to join this project",
        status: existingRequest[0].status,
      });
    }

    // Create collaboration request
    const request = await sql`
      INSERT INTO project_collaborators (
        project_id,
        user_id,
        address,
        role,
        status
      )
      VALUES (
        ${projectId},
        ${req.user.id},
        ${req.user.address},
        ${role || "Contributor"},
        'Pending'
      )
      RETURNING *
    `;

    res.status(201).json(request[0]);
  } catch (error) {
    console.error("Error creating collaboration request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Respond to a collaboration request (approve/reject)
router.put("/:id/collaborate/:userId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const projectId = req.params.id;
    const userId = req.params.userId;

    // Verify project ownership
    const project = await sql`
      SELECT * FROM project_details WHERE project_id = ${projectId} AND owner_address = ${req.user.address}
    `;

    if (project.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this project" });
    }

    // Update request status
    const updatedRequest = await sql`
      UPDATE project_collaborators
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = ${projectId} AND user_id = ${userId}
      RETURNING *
    `;

    if (updatedRequest.length === 0) {
      return res.status(404).json({ error: "Collaboration request not found" });
    }

    res.json(updatedRequest[0]);
  } catch (error) {
    console.error("Error responding to collaboration request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove a collaborator from a project
router.delete("/:id/collaborate/:userId", auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.params.userId;

    // Verify project ownership
    const project = await sql`
      SELECT * FROM project_details
      WHERE project_id = ${projectId} AND owner_address = ${req.user.address}
    `;

    if (project.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this project" });
    }

    // Delete the collaborator record
    const deletedCollaborator = await sql`
      DELETE FROM project_collaborators
      WHERE project_id = ${projectId} AND user_id = ${userId}
      RETURNING *
    `;

    if (deletedCollaborator.length === 0) {
      return res.status(404).json({ error: "Collaborator not found" });
    }

    // Return success response
    res.json({
      message: "Collaborator removed successfully",
      collaborator: deletedCollaborator[0],
    });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Project Recovery Route - This handles re-syncing projects with sync issues
router.post("/recover", auth, async (req, res) => {
  try {
    const { project_id } = req.body;

    if (!project_id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Verify project exists and user has permission (owner)
    const project = await sql`
      SELECT * FROM project_details
      WHERE project_id = ${project_id}
    `;

    if (project.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // For security, only allow owners to recover their own projects
    if (project[0].owner_address !== req.user.address) {
      return res
        .status(403)
        .json({ error: "Not authorized to recover this project" });
    }

    // In a real implementation, this would use your smart contract integration
    // to reconcile the database and blockchain state

    // For this implementation, we'll mark the project as synced
    // by returning success. In a real implementation you'd update a sync status table

    // Return success
    res.json({
      success: true,
      message: "Project recovery initiated successfully",
      project_id: project_id,
    });
  } catch (error) {
    console.error("Error recovering project:", error);
    res.status(500).json({
      error: "Server error during recovery",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

module.exports = router;
