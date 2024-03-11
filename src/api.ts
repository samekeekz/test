import groupsData from "../groups.json";
import { GetGroupsResponse } from "./types";

export const fetchGroups = async (): Promise<GetGroupsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ result: 1, data: groupsData });
    }, 1000);
  });
};
