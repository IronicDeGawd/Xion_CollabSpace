use cosmwasm_std::Addr;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::ProjectStatus;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: Option<String>, // Optional admin address
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    CreateProject {
        title: String,
        description: String,
        skills_required: Vec<String>,
        is_paid: bool,
    },
    UpdateProjectStatus {
        project_id: String,
        status: ProjectStatus,
    },
    RequestCollaboration {
        project_id: String,
        collaborator: Addr,
    },
    DeleteProject {
        project_id: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum QueryMsg {
    GetProject { project_id: String },
    ListProjects {},
}
