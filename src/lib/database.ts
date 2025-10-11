import Database from "@tauri-apps/plugin-sql";

export const getDatabase = (): Promise<Database> => {
  return Database.load("sqlite:database.db");
};
