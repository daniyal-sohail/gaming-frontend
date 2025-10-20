"use client";
import { useState, useEffect } from "react";
import { X, Edit2 } from "lucide-react";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function EditMemberModal({ teamId, member, isOpen, onClose }) {
    const { updateMember, loading } = useTeamSelection();

    const [memberData, setMemberData] = useState({
        role: "",
        allocation: 100,
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        if (member) {
            setMemberData({
                role: member.role || "",
                allocation: member.allocation || 100,
                startDate: member.startDate ? new Date(member.startDate).toISOString().split('T')[0] : "",
                endDate: member.endDate ? new Date(member.endDate).toISOString().split('T')[0] : ""
            });
        }
    }, [member]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateMember(teamId, member.consultant._id, {
                role: memberData.role,
                allocation: Number(memberData.allocation),
                startDate: memberData.startDate || undefined,
                endDate: memberData.endDate || undefined
            });
            onClose();
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    if (!isOpen || !member) return null;

    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Edit2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Edit Member</h2>
                            <p className="text-sm text-gray-400">Update member details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Current Member Info */}
                    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                                {getInitials(member.consultant.user?.name)}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    {member.consultant.user?.name || "Anonymous"}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {member.consultant.title || "Consultant"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
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
                            <label className="block text-sm font-medium text-gray-300 mb-2">
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
                            <p className="text-xs text-gray-500 mt-1">
                                Percentage of time this member will dedicate to the project
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={memberData.startDate}
                                    onChange={(e) => setMemberData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={memberData.endDate}
                                    onChange={(e) => setMemberData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Update Member
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}