use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut,
    Env, MessageInfo, Response, StdResult, Addr, StdError
};
use cw_storage_plus::Item;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub description: String,
    pub owner: Addr,
    pub skills_required: Vec<String>,
    pub status: ProjectStatus,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ProjectStatus {
    Open,
    InProgress,
    Completed,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    // No initialization parameters needed for now
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    CreateProject {
        title: String,
        description: String,
        skills_required: Vec<String>,
    },
    UpdateProjectStatus {
        project_id: String,
        status: ProjectStatus,
    },
    RequestCollaboration {
        project_id: String,
        collaborator: Addr,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum QueryMsg {
    GetProject { project_id: String },
    ListProjects {},
}

// Define storage for projects
pub const PROJECTS: Item<Vec<Project>> = Item::new("projects");

// Instantiate entry point
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    // Initialize an empty projects vector
    PROJECTS.save(deps.storage, &vec![])?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

// Execute entry point
#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateProject {
            title,
            description,
            skills_required,
        } => create_project(deps, info, title, description, skills_required),
        ExecuteMsg::UpdateProjectStatus { project_id, status } =>
            update_project_status(deps, info, project_id, status),
        ExecuteMsg::RequestCollaboration { project_id, collaborator } =>
            request_collaboration(deps, info, project_id, collaborator),
    }
}

pub fn create_project(
    deps: DepsMut,
    info: MessageInfo,
    title: String,
    description: String,
    skills_required: Vec<String>,
) -> StdResult<Response> {
    let project_id = title.clone(); // Using title as the project_id for simplicity
    let project = Project {
        id: project_id.clone(),
        title,
        description,
        owner: info.sender,
        skills_required,
        status: ProjectStatus::Open, // default status is Open
    };

    // Load existing projects
    let mut projects = PROJECTS.load(deps.storage)?;

    // Check if a project with the same ID already exists
    if projects.iter().any(|p| p.id == project_id) {
        return Err(StdError::generic_err("Project with this ID already exists"));
    }

    // Add the new project
    projects.push(project);

    // Save updated projects
    PROJECTS.save(deps.storage, &projects)?;

    Ok(Response::new()
        .add_attribute("method", "create_project")
        .add_attribute("project_id", project_id))
}

pub fn update_project_status(
    deps: DepsMut,
    info: MessageInfo,
    project_id: String,
    status: ProjectStatus,
) -> StdResult<Response> {
    let mut projects = PROJECTS.load(deps.storage)?;

    // Find the project and update its status
    let project = projects.iter_mut().find(|p| p.id == project_id);

    match project {
        Some(project) => {
            // Ensure only the owner can update the status
            if project.owner != info.sender {
                return Err(StdError::generic_err("Not authorized"));
            }

            project.status = status;
            PROJECTS.save(deps.storage, &projects)?;

            Ok(Response::new()
                .add_attribute("method", "update_project_status")
                .add_attribute("project_id", project_id))
        },
        None => Err(StdError::not_found("Project not found")),
    }
}

pub fn request_collaboration(
    deps: DepsMut,
    info: MessageInfo,
    project_id: String,
    collaborator: Addr,
) -> StdResult<Response> {
    // Load projects to verify project exists
    let projects = PROJECTS.load(deps.storage)?;

    // Check if project exists
    if !projects.iter().any(|p| p.id == project_id) {
        return Err(StdError::not_found("Project not found"));
    }

    // For now, just emit events without state changes
    // In a real implementation, you might store collaboration requests

    Ok(Response::new()
        .add_attribute("method", "request_collaboration")
        .add_attribute("project_id", project_id)
        .add_attribute("requester", info.sender)
        .add_attribute("collaborator", collaborator.to_string()))
}

// Query entry point
#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetProject { project_id } => query_project(deps, project_id),
        QueryMsg::ListProjects {} => query_list_projects(deps),
    }
}

fn query_project(deps: Deps, project_id: String) -> StdResult<Binary> {
    let projects = PROJECTS.load(deps.storage)?;

    // Find the project by ID
    if let Some(project) = projects.iter().find(|p| p.id == project_id) {
        return to_json_binary(project);
    }

    Err(StdError::not_found("Project not found"))
}

fn query_list_projects(deps: Deps) -> StdResult<Binary> {
    let projects = PROJECTS.load(deps.storage)?;
    to_json_binary(&projects)
}
