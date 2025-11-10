"use client";
import { useState, useEffect } from "react";
import { X, UserPlus, Search, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function AddMemberModal({ teamId, isOpen, onClose }) {
    const { addMember, getRecommendations, loading } = useTeamSelection();

    const [consultants, setConsultants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [memberData, setMemberData] = useState({
        role: "",
        allocation: 100,
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        if (isOpen && teamId) {
            loadRecommendations();
        }
    }, [isOpen, teamId]);

    const loadRecommendations = async () => {
        try {
            const recs = await getRecommendations(teamId);
            setConsultants(recs);
        } catch (error) {
            console.error("Error loading recommendations:", error);
        }
    };

    const filteredConsultants = consultants.filter(consultant =>
        consultant.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSelectConsultant = (consultant) => {
        setSelectedConsultant(consultant);
        // Auto-fill role from consultant's first role
        if (consultant.roles && consultant.roles.length > 0) {
            setMemberData(prev => ({ ...prev, role: consultant.roles[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedConsultant) return;

        try {
            await addMember(teamId, {
                consultant: selectedConsultant._id,
                role: memberData.role,
                allocation: Number(memberData.allocation),
                startDate: memberData.startDate || undefined,
                endDate: memberData.endDate || undefined
            });
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const resetForm = () => {
        setSelectedConsultant(null);
        setMemberData({
            role: "",
            allocation: 100,
            startDate: "",
            endDate: ""
        });
        setSearchTerm("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm">
            <div className="bg-white border border-black/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Add Team Member</h2>
                            <p className="text-sm text-gray-600">Select a consultant from recommendations</p>
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
                    {!selectedConsultant ? (
                        <>
                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search consultants by name, title, or skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                            </div>

                            {/* Consultants List */}
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredConsultants.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-600">No consultants found</p>
                                    </div>
                                ) : (
                                    filteredConsultants.map((consultant) => (
                                        <ConsultantSelectCard
                                            key={consultant._id}
                                            consultant={consultant}
                                            onSelect={() => handleSelectConsultant(consultant)}
                                        />
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Selected Consultant */}
                            <div className="mb-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-lg font-bold text-white">
                                            {selectedConsultant.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "C"}
                                        </div>
                                        <div>
                                            <h3 className="text-black font-semibold">
                                                {selectedConsultant.user?.name || "Anonymous"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {selectedConsultant.title || "Consultant"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedConsultant(null)}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Member Details Form */}
                            <div className="space-y-4">
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
                                        className="w-full px-4 py-3 bg-white border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                                        className="w-full px-4 py-3 bg-white border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                            className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                    disabled={loading}
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
                                            Add Member
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

function ConsultantSelectCard({ consultant, onSelect }) {
    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div
            onClick={onSelect}
            className="p-4 bg-black/5 border border-black/10 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {getInitials(consultant.user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-black font-semibold mb-1 group-hover:text-cyan-500 transition-colors">
                        {consultant.user?.name || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{consultant.title || "Consultant"}</p>

                    {consultant.skills && consultant.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {consultant.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-xs rounded">
                                    {skill}
                                </span>
                            ))}
                            {consultant.skills.length > 3 && (
                                <span className="px-2 py-0.5 bg-black/10 text-gray-600 text-xs rounded">
                                    +{consultant.skills.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        {consultant.experienceYears && (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {consultant.experienceYears} yrs
                            </span>
                        )}
                        {consultant.baseRate?.hourly && (
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${consultant.baseRate.hourly}/hr
                            </span>
                        )}
                        {consultant.availability?.timezone && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {consultant.availability.timezone}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}