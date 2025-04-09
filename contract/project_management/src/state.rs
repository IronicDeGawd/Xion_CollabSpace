use cosmwasm_std::{Addr, Storage, StdResult};
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
    pub is_paid: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ProjectStatus {
    Open,
    InProgress,
    Completed,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
}

// Storage items
pub const PROJECTS: Item<Vec<Project>> = Item::new("projects");
pub const CONFIG: Item<Config> = Item::new("config");
pub const PROJECT_COUNT: Item<u64> = Item::new("project_count");

// Helper function to initialize projects
pub fn initialize_projects(storage: &mut dyn Storage) -> StdResult<()> {
    PROJECTS.save(storage, &vec![])
}

// Helper function to initialize project counter
pub fn initialize_project_count(storage: &mut dyn Storage) -> StdResult<()> {
    PROJECT_COUNT.save(storage, &0u64)
}
