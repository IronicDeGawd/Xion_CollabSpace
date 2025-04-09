use cosmwasm_std::{Addr, DepsMut, Env, MessageInfo, Response};
use crate::state::{Project, ProjectStatus, PROJECTS, CONFIG, PROJECT_COUNT};
use crate::error::ContractError;

pub fn create_project(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    title: String,
    description: String,
    skills_required: Vec<String>,
    is_paid: bool,
) -> Result<Response, ContractError> {
    // Generate a unique project ID
    let count = PROJECT_COUNT.load(deps.storage)?;
    let new_count = count + 1;

    // Use counter + timestamp + part of address for uniqueness
    let timestamp = env.block.time.seconds();
    let addr_suffix = info.sender.as_str().chars().take(6).collect::<String>();

    let project_id = format!("proj-{}-{}-{}", new_count, timestamp, addr_suffix);

    let project = Project {
        id: project_id.clone(),
        title,
        description,
        owner: info.sender,
        skills_required,
        status: ProjectStatus::Open,
        is_paid,
    };

    // Load existing projects
    let mut projects = PROJECTS.load(deps.storage)?;

    // Add the new project
    projects.push(project);

    // Save updated projects and update counter
    PROJECTS.save(deps.storage, &projects)?;
    PROJECT_COUNT.save(deps.storage, &new_count)?;

    Ok(Response::new()
        .add_attribute("method", "create_project")
        .add_attribute("project_id", project_id)
        .add_attribute("is_paid", is_paid.to_string()))
}

pub fn update_project_status(
    deps: DepsMut,
    info: MessageInfo,
    project_id: String,
    status: ProjectStatus,
) -> Result<Response, ContractError> {
    let mut projects = PROJECTS.load(deps.storage)?;

    // Find the project and update its status
    let project = projects.iter_mut().find(|p| p.id == project_id);

    match project {
        Some(project) => {
            // Ensure only the owner can update the status
            if project.owner != info.sender {
                return Err(ContractError::Unauthorized {});
            }

            project.status = status;
            PROJECTS.save(deps.storage, &projects)?;

            Ok(Response::new()
                .add_attribute("method", "update_project_status")
                .add_attribute("project_id", project_id))
        },
        None => Err(ContractError::ProjectNotFound(project_id)),
    }
}

pub fn request_collaboration(
    deps: DepsMut,
    info: MessageInfo,
    project_id: String,
    collaborator: Addr,
) -> Result<Response, ContractError> {
    // Load projects to verify project exists
    let projects = PROJECTS.load(deps.storage)?;

    // Check if project exists
    if !projects.iter().any(|p| p.id == project_id) {
        return Err(ContractError::ProjectNotFound(project_id));
    }

    Ok(Response::new()
        .add_attribute("method", "request_collaboration")
        .add_attribute("project_id", project_id)
        .add_attribute("requester", info.sender)
        .add_attribute("collaborator", collaborator.to_string()))
}

pub fn delete_project(
    deps: DepsMut,
    info: MessageInfo,
    project_id: String,
) -> Result<Response, ContractError> {
    let mut projects = PROJECTS.load(deps.storage)?;

    // Check if project exists and get its index
    let project_index = projects.iter().position(|p| p.id == project_id)
        .ok_or_else(|| ContractError::ProjectNotFound(project_id.clone()))?;

    // Verify authorization: only the project owner or admin can delete
    let config = CONFIG.load(deps.storage)?;
    let is_admin = info.sender == config.admin;
    let is_owner = projects[project_index].owner == info.sender;

    if !is_admin && !is_owner {
        return Err(ContractError::Unauthorized {});
    }

    // Remove the project
    projects.remove(project_index);

    // Save updated projects
    PROJECTS.save(deps.storage, &projects)?;

    Ok(Response::new()
        .add_attribute("method", "delete_project")
        .add_attribute("project_id", project_id)
        .add_attribute("deleted_by", if is_admin { "admin" } else { "owner" }))
}
