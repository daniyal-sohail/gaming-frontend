"use client";
import { useEffect, useState, useRef } from "react";
import { useConsultant } from "@/context/ConsultantContext";
import { useTeamSelection } from "@/context/TeamSelectionContext";
import { Search, Filter, X, MapPin, Clock, DollarSign, TrendingUp, ChevronLeft, ChevronRight, Users, UserPlus, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import AddToTeamModal from "../teamSelection/AddToTeamModal";
import CreateTeamModal from "../teamSelection/CreateTeamModal";

export default function AllConsultant() {
    const router = useRouter();
    const { consultants, pagination, loading, error, searchConsultantsWithFilters, fetchAllConsultants, clearError } = useConsultant();
    const { teams, getTeams } = useTeamSelection();

    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [filters, setFilters] = useState({
        skills: [],
        minExperience: "",
        preferredTimezone: "",
        remote: "",
        maxHourlyRate: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [skillInput, setSkillInput] = useState("");

    const debouncedSearchRef = useRef(
        debounce(async (searchFilters, page, fetchFn, searchFn) => {
            try {
                const hasFilters =
                    (searchFilters.skills && searchFilters.skills.length > 0) ||
                    searchFilters.minExperience ||
                    searchFilters.preferredTimezone ||
                    searchFilters.remote !== "" ||
                    searchFilters.maxHourlyRate;

                if (!hasFilters) {
                    await fetchFn({ page, limit: 12 });
                } else {
                    const cleanFilters = {
                        skills: searchFilters.skills.length > 0 ? searchFilters.skills : undefined,
                        minExperience: searchFilters.minExperience ? Number(searchFilters.minExperience) : undefined,
                        preferredTimezone: searchFilters.preferredTimezone || undefined,
                        remote: searchFilters.remote !== "" ? searchFilters.remote === "true" : undefined,
                        maxHourlyRate: searchFilters.maxHourlyRate ? Number(searchFilters.maxHourlyRate) : undefined
                    };
                    await searchFn(cleanFilters, { page, limit: 12 });
                }
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 500)
    );

    // Load teams on component mount
    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        return () => {
            debouncedSearchRef.current.cancel();
        };
    }, []);

    useEffect(() => {
        const currentFilters = { ...filters };

        if (searchTerm.trim()) {
            const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
            currentFilters.skills = [...new Set([...filters.skills, ...searchWords])];
        }

        debouncedSearchRef.current(currentFilters, currentPage, fetchAllConsultants, searchConsultantsWithFilters);
    }, [searchTerm, filters.skills, filters.minExperience, filters.preferredTimezone, filters.remote, filters.maxHourlyRate, currentPage]);

    const loadTeams = async () => {
        try {
            await getTeams({ page: 1, limit: 100 });
        } catch (error) {
            console.error("Error loading teams:", error);
        }
    };

    // Helper function to get teams a consultant is in
    const getConsultantTeams = (consultantId) => {
        if (!teams || !consultantId) return [];

        return teams.filter(team =>
            team.members?.some(member =>
                member.consultant?._id === consultantId ||
                member.consultant === consultantId
            )
        );
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const addSkill = () => {
        if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
            setFilters(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput("");
            setCurrentPage(1);
        }
    };

    const removeSkill = (skill) => {
        setFilters(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilters({
            skills: [],
            minExperience: "",
            preferredTimezone: "",
            remote: "",
            maxHourlyRate: ""
        });
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConsultantClick = (consultantId) => {
        router.push(`/consultants/${consultantId}`);
    };

    const handleAddToTeam = (consultant, e) => {
        e.stopPropagation();
        setSelectedConsultant(consultant);
    };

    const handleCloseModal = () => {
        setSelectedConsultant(null);
        // Reload teams to get updated data
        loadTeams();
    };

    return (
        <section className="text-white py-20 max-w-6xl mx-auto mt-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header with Create Team Button */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Find Expert Consultants</h1>
                        <p className="text-gray-400">Browse through our network of verified professionals</p>
                    </div>
                    <button
                        onClick={() => setShowCreateTeam(true)}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 font-medium flex items-center gap-2"
                    >
                        <Users className="w-5 h-5" />
                        Create Team
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between">
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={clearError} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="mb-6 bg-[#121212] border border-gray-800 rounded-2xl p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${showFilters ? "bg-primary text-white" : "bg-[#0d0d0d] text-gray-300 hover:bg-gray-800"}`}
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add skill (e.g., React, Node.js)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                        className="flex-1 px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    />
                                    <button onClick={addSkill} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                        Add
                                    </button>
                                </div>
                                {filters.skills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {filters.skills.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Min. Experience (years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 5"
                                    value={filters.minExperience}
                                    onChange={(e) => handleFilterChange("minExperience", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                                <input
                                    type="text"
                                    placeholder="e.g., UTC, EST, PST"
                                    value={filters.preferredTimezone}
                                    onChange={(e) => handleFilterChange("preferredTimezone", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Max. Hourly Rate ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 100"
                                    value={filters.maxHourlyRate}
                                    onChange={(e) => handleFilterChange("maxHourlyRate", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Work Type</label>
                                <select
                                    value={filters.remote}
                                    onChange={(e) => handleFilterChange("remote", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">All</option>
                                    <option value="true">Remote</option>
                                    <option value="false">On-site</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <button onClick={clearAllFilters} className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="mb-6 text-gray-400">
                        Found <span className="text-white font-semibold">{pagination.total}</span> consultants
                    </div>
                )}

                {loading ? (
                    <ConsultantSkeleton />
                ) : consultants.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {consultants.map((consultant) => (
                                <ConsultantCard
                                    key={consultant._id}
                                    consultant={consultant}
                                    consultantTeams={getConsultantTeams(consultant._id)}
                                    onClick={() => handleConsultantClick(consultant._id)}
                                    onAddToTeam={(e) => handleAddToTeam(consultant, e)}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-12 h-12 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No consultants found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                        <button onClick={clearAllFilters} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {showCreateTeam && (
                <CreateTeamModal
                    isOpen={showCreateTeam}
                    onClose={() => {
                        setShowCreateTeam(false);
                        loadTeams();
                    }}
                />
            )}

            {/* Add to Team Modal */}
            {selectedConsultant && (
                <AddToTeamModal
                    consultant={selectedConsultant}
                    isOpen={!!selectedConsultant}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
}

function ConsultantCard({ consultant, consultantTeams, onClick, onAddToTeam }) {
    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const isInTeam = consultantTeams && consultantTeams.length > 0;

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group hover:shadow-2xl hover:shadow-primary/10">
            <div className="relative h-24 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20">
                <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white ring-4 ring-[#121212] group-hover:ring-primary/20 transition-all">
                        {getInitials(consultant.user?.name)}
                    </div>
                </div>
            </div>

            <div className="pt-14 px-6 pb-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        {consultant.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-400">{consultant.title || "Consultant"}</p>
                </div>

                {/* Show team badges if consultant is in teams */}
                {isInTeam && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {consultantTeams.map((team) => (
                            <div
                                key={team._id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-lg border border-green-500/20"
                            >
                                <CheckCircle className="w-3 h-3" />
                                <span className="font-medium">{team.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {consultant.skills && consultant.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {consultant.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                                {skill}
                            </span>
                        ))}
                        {consultant.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg">
                                +{consultant.skills.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>{consultant.experienceYears || 0} years experience</span>
                    </div>
                    {consultant.baseRate?.hourly && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            <span>${consultant.baseRate.hourly}/hr</span>
                        </div>
                    )}
                    {consultant.availability?.timezone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{consultant.availability.timezone}</span>
                        </div>
                    )}
                    {consultant.availability?.remote !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span>{consultant.availability.remote ? "Remote" : "On-site"}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClick}
                        className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-primary transition-colors group-hover:bg-primary"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={onAddToTeam}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${isInTeam
                                ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            }`}
                        title={isInTeam ? "Already in team" : "Add to Team"}
                    >
                        {isInTeam ? <CheckCircle className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConsultantSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="h-24 bg-gray-800 animate-pulse"></div>
                    <div className="pt-14 px-6 pb-6">
                        <div className="h-6 bg-gray-800 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-800 rounded w-2/3 mb-4 animate-pulse"></div>
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 bg-gray-800 rounded w-16 animate-pulse"></div>
                            <div className="h-6 bg-gray-800 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start < showPages - 1) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === currentPage ? "bg-primary text-white" : "bg-[#121212] border border-gray-800 text-gray-400 hover:bg-gray-800"}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}