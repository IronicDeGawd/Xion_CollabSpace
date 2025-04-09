use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult
};

mod state;
mod msg;
mod error;
mod execute;
mod query;

use msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use state::Config;
use crate::state::{CONFIG, initialize_projects, initialize_project_count};

// Instantiate entry point
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, error::ContractError> {
    // Initialize project storage
    initialize_projects(deps.storage)?;

    // Initialize project counter
    initialize_project_count(deps.storage)?;

    // Set admin
    let admin = msg.admin.map_or(Ok(info.sender), |addr| deps.api.addr_validate(&addr))?;
    let config = Config { admin };
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

// Execute entry point
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, error::ContractError> {
    match msg {
        ExecuteMsg::CreateProject {
            title,
            description,
            skills_required,
            is_paid,
        } => execute::create_project(deps, env, info, title, description, skills_required, is_paid),
        ExecuteMsg::UpdateProjectStatus { project_id, status } =>
            execute::update_project_status(deps, info, project_id, status),
        ExecuteMsg::RequestCollaboration { project_id, collaborator } =>
            execute::request_collaboration(deps, info, project_id, collaborator),
        ExecuteMsg::DeleteProject { project_id } =>
            execute::delete_project(deps, info, project_id),
    }
}

// Query entry point
#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetProject { project_id } => query::query_project(deps, project_id),
        QueryMsg::ListProjects {} => query::query_list_projects(deps),
    }
}
