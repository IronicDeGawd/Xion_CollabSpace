use cosmwasm_std::{to_json_binary, Binary, Deps, StdError, StdResult};

use crate::state::PROJECTS;

pub fn query_project(deps: Deps, project_id: String) -> StdResult<Binary> {
    let projects = PROJECTS.load(deps.storage)?;

    // Find the project by ID
    if let Some(project) = projects.iter().find(|p| p.id == project_id) {
        return to_json_binary(project);
    }

    Err(StdError::not_found(format!("Project with ID {} not found", project_id)))
}

pub fn query_list_projects(deps: Deps) -> StdResult<Binary> {
    let projects = PROJECTS.load(deps.storage)?;
    to_json_binary(&projects)
}
