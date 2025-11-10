"use client";
import { useState, useEffect } from "react";
import { X, UserPlus, Users, AlertCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function AddToTeamModal({ consultant, isOpen, onClose }) {
    const router = useRouter();
    const { teams, getTeams, addMember, loading } = useTeamSelection();

    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [memberData, setMemberData] = useState({
        role: "",
        allocation: 100,
        startDate: "",
        endDate: ""
    });
    const [loadingTeams, setLoadingTeams] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadTeams();
            // Auto-fill role from consultant's first role
            if (consultant.roles && consultant.roles.length > 0) {
                setMemberData(prev => ({ ...prev, role: consultant.roles[0] }));
            } else if (consultant.title) {
                setMemberData(prev => ({ ...prev, role: consultant.title }));
            }
        }
    }, [isOpen, consultant]);

    const loadTeams = async () => {
        setLoadingTeams(true);
        try {
            await getTeams({ page: 1, limit: 100 });
        } catch (error) {
            console.error("Error loading teams:", error);
        } finally {
            setLoadingTeams(false);
        }
    };

    const getAvailableTeams = () => {
        if (!teams || !consultant) return [];

        // Filter teams that:
        // 1. Have less than 3 members
        // 2. Don't already have this consultant
        return teams.filter(team => {
            const memberCount = team.members?.length || 0;
            const hasConsultant = team.members?.some(m =>
                m.consultant._id === consultant._id || m.consultant === consultant._id
            );
            return memberCount < 3 && !hasConsultant;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTeamId) return;

        try {
            await addMember(selectedTeamId, {
                consultant: consultant._id,
                role: memberData.role,
                allocation: Number(memberData.allocation),
                startDate: memberData.startDate || undefined,
                endDate: memberData.endDate || undefined
            });

            // Reload teams after successful addition
            await loadTeams();

            resetForm();
            onClose();
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const resetForm = () => {
        setSelectedTeamId("");
        setMemberData({
            role: "",
            allocation: 100,
            startDate: "",
            endDate: ""
        });
    };

    if (!isOpen) return null;

    const availableTeams = getAvailableTeams();
    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
            <div className="bg-white border border-black/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Add to Team</h2>
                            <p className="text-sm text-gray-600">Select a team to add this consultant</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-gray-600 hover:text-black transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Consultant Info */}
                    <div className="mb-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-lg font-bold text-white">
                                {getInitials(consultant.user?.name)}
                            </div>
                            <div>
                                <h3 className="text-black font-semibold">
                                    {consultant.user?.name || "Anonymous"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {consultant.title || "Consultant"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingTeams ? (
                        <div className="py-8 text-center">
                            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-600 text-sm">Loading your teams...</p>
                        </div>
                    ) : availableTeams.length === 0 ? (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">No Available Teams</h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                {teams.length === 0
                                    ? "You haven't created any teams yet."
                                    : "All your teams are either full (3/3 members) or already have this consultant."}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.push('/teams');
                                }}
                                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Team
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Team Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Team <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        required
                                        value={selectedTeamId}
                                        onChange={(e) => setSelectedTeamId(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-black/20 rounded-xl text-black focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    >
                                        <option value="">-- Choose a team --</option>
                                        {availableTeams.map((team) => (
                                            <option key={team._id} value={team._id}>
                                                {team.name} ({team.members?.length || 0}/3 members)
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Only showing teams with available slots
                                    </p>
                                </div>

                                {/* Show selected team info */}
                                {selectedTeamId && (
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-600">
                                            <p className="font-medium">
                                                {teams.find(t => t._id === selectedTeamId)?.name}
                                            </p>
                                            <p className="text-blue-600/80 text-xs">
                                                {teams.find(t => t._id === selectedTeamId)?.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role in Team <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={memberData.role}
                                        onChange={(e) => setMemberData(prev => ({ ...prev, role: e.target.value }))}
                                        placeholder="e.g., Senior Developer, UI Designer"
                                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Allocation (%) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="100"
                                        value={memberData.allocation}
                                        onChange={(e) => setMemberData(prev => ({ ...prev, allocation: e.target.value }))}
                                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        Percentage of time this member will dedicate to the project
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={memberData.startDate}
                                            onChange={(e) => setMemberData(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white border border-black/20 rounded-xl text-black focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={memberData.endDate}
                                            onChange={(e) => setMemberData(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white border border-black/20 rounded-xl text-black focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-black/10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        resetForm();
                                    }}
                                    className="px-6 py-3 bg-black/10 text-black rounded-xl hover:bg-black/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedTeamId}
                                    className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Add to Team
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}