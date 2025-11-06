import API from "@/config/ApiConfig";

// Get My Team Assignments - Get all teams where the consultant is a member
export const getMyTeamAssignments = async () => {
    try {
        const response = await API.get("/consultants/assignments/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get Team By ID - Get detailed information about a specific team
export const getTeamById = async (teamId) => {
    try {
        const response = await API.get(`/consultants/teams/${teamId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

