"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Users,
    Plus,
    Trash2,
    Edit2,
    DollarSign,
    Clock,
    TrendingUp,
    Settings,
    Save,
    X,
    AlertCircle
} from "lucide-react";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function TeamDetail() {
    const params = useParams();
    const router = useRouter();
    const {
        currentTeam,
        loading,
        error,
        getTeamById,
        updateTeam,
        removeMember,
        calculateLivePricing
    } = useTeamSelection();

    // Handle both [teamId] and [teamid] folder names
    const teamId = params.teamId || params.teamid;
    const [showAddMember, setShowAddMember] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [livePrice, setLivePrice] = useState(null);
    const [pricingLoading, setPricingLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [teamData, setTeamData] = useState({
        name: "",
        description: "",
        billingPeriod: "hourly",
        projectDuration: {
            startDate: "",
            endDate: "",
            estimatedHours: ""
        },
        taxPercent: 0,
        discountPercent: 0
    });

    useEffect(() => {
        console.log("=== TeamDetail Mount ===");
        console.log("Full params object:", params);
        console.log("Team ID from params:", teamId);
        console.log("URL pathname:", window.location.pathname);
        console.log("Context available:", { loading, error, hasTeam: !!currentTeam });

        if (teamId) {
            loadTeam();
        } else {
            console.error("❌ No team ID provided!");
            console.error("Available params:", Object.keys(params));
            setLocalError("No team ID provided in URL");
            setIsInitialLoad(false);
        }
    }, [teamId]);

    useEffect(() => {
        if (currentTeam) {
            console.log("✅ Current team loaded:", currentTeam);
            setTeamData({
                name: currentTeam.name || "",
                description: currentTeam.description || "",
                billingPeriod: currentTeam.billingPeriod || "hourly",
                projectDuration: {
                    startDate: currentTeam.projectDuration?.startDate?.split('T')[0] || "",
                    endDate: currentTeam.projectDuration?.endDate?.split('T')[0] || "",
                    estimatedHours: currentTeam.projectDuration?.estimatedHours || ""
                },
                taxPercent: currentTeam.taxPercent || 0,
                discountPercent: currentTeam.discountPercent || 0
            });
            setIsInitialLoad(false);
        }
    }, [currentTeam?._id]);

    useEffect(() => {
        const calculatePrice = async () => {
            if (!currentTeam?.members || currentTeam.members.length === 0) {
                setLivePrice(null);
                return;
            }

            setPricingLoading(true);
            try {
                const pricing = await calculateLivePricing({
                    members: currentTeam.members,
                    billingPeriod: teamData.billingPeriod,
                    projectDuration: {
                        startDate: teamData.projectDuration.startDate || undefined,
                        endDate: teamData.projectDuration.endDate || undefined,
                        estimatedHours: teamData.projectDuration.estimatedHours ? Number(teamData.projectDuration.estimatedHours) : undefined
                    },
                    taxPercent: Number(teamData.taxPercent) || 0,
                    discountPercent: Number(teamData.discountPercent) || 0
                });
                console.log("💰 Pricing calculated:", pricing);
                setLivePrice(pricing);
            } catch (err) {
                console.error("❌ Pricing calculation error:", err);
                setLivePrice(null);
            } finally {
                setPricingLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            calculatePrice();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        currentTeam?.members?.length,
        teamData.billingPeriod,
        teamData.projectDuration.startDate,
        teamData.projectDuration.endDate,
        teamData.projectDuration.estimatedHours,
        teamData.taxPercent,
        teamData.discountPercent
    ]);

    const loadTeam = async () => {
        console.log("🔄 Loading team:", teamId);
        console.log("Team ID type:", typeof teamId);
        console.log("Team ID length:", teamId?.length);
        setLocalError(null);
        try {
            const result = await getTeamById(teamId);
            console.log("✅ Team loaded successfully:", result);
        } catch (err) {
            console.error("❌ Error loading team:", err);
            console.error("Error details:", {
                message: err.message,
                response: err.response,
                status: err.status
            });
            setLocalError(err.message || "Failed to load team");
            setIsInitialLoad(false);
        }
    };

    const handleSaveTeam = async () => {
        try {
            await updateTeam(teamId, {
                name: teamData.name,
                description: teamData.description,
                billingPeriod: teamData.billingPeriod,
                projectDuration: {
                    startDate: teamData.projectDuration.startDate || undefined,
                    endDate: teamData.projectDuration.endDate || undefined,
                    estimatedHours: teamData.projectDuration.estimatedHours ? Number(teamData.projectDuration.estimatedHours) : undefined
                },
                taxPercent: Number(teamData.taxPercent) || 0,
                discountPercent: Number(teamData.discountPercent) || 0
            });
            setEditMode(false);
        } catch (err) {
            console.error("Error updating team:", err);
        }
    };

    const handleRemoveMember = async (consultantId) => {
        if (confirm("Are you sure you want to remove this member?")) {
            try {
                await removeMember(teamId, consultantId);
                await loadTeam();
            } catch (err) {
                console.error("Error removing member:", err);
            }
        }
    };

    const handleModalClose = () => {
        setShowAddMember(false);
        setEditingMember(null);
        loadTeam();
    };

    console.log("🎨 Render state:", {
        isInitialLoad,
        loading,
        hasError: !!(error || localError),
        hasTeam: !!currentTeam,
        teamId
    });

    // Show skeleton only during initial load
    if (isInitialLoad && loading && !currentTeam) {
        console.log("⏳ Showing skeleton - initial load");
        return <DetailSkeleton />;
    }

    // Show error if there's an error
    if (error || localError) {
        console.log("❌ Showing error:", error || localError);
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Team</h2>
                    <p className="text-gray-400 mb-6">{error || localError}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setLocalError(null);
                                loadTeam();
                            }}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 w-full"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push("/teams")}
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full"
                        >
                            Back to Teams
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show not found if no team after loading
    if (!loading && !currentTeam) {
        console.log("❓ Team not found");
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Team Not Found</h2>
                    <p className="text-gray-400 mb-6">The team you're looking for doesn't exist or you don't have access to it.</p>
                    <button
                        onClick={() => router.push("/teams")}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Back to Teams
                    </button>
                </div>
            </div>
        );
    }

    if (!currentTeam) {
        console.log("⏳ Still loading, showing skeleton");
        return <DetailSkeleton />;
    }

    console.log("✨ Rendering team page");

    const members = currentTeam.members || [];
    const canAddMembers = members.length < 3;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.push("/teams")}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Teams
                </button>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            {editMode ? (
                                <input
                                    type="text"
                                    value={teamData.name}
                                    onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                                    className="text-4xl font-bold text-white bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-2 w-full mb-4 focus:outline-none focus:border-primary"
                                />
                            ) : (
                                <h1 className="text-4xl font-bold text-white mb-2">{currentTeam.name}</h1>
                            )}
                            {editMode ? (
                                <textarea
                                    value={teamData.description}
                                    onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
                                    className="text-gray-300 bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-2 w-full resize-none focus:outline-none focus:border-primary"
                                    rows={2}
                                />
                            ) : (
                                <p className="text-gray-400">{currentTeam.description || "No description"}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            {editMode ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            if (currentTeam) {
                                                setTeamData({
                                                    name: currentTeam.name || "",
                                                    description: currentTeam.description || "",
                                                    billingPeriod: currentTeam.billingPeriod || "hourly",
                                                    projectDuration: {
                                                        startDate: currentTeam.projectDuration?.startDate?.split('T')[0] || "",
                                                        endDate: currentTeam.projectDuration?.endDate?.split('T')[0] || "",
                                                        estimatedHours: currentTeam.projectDuration?.estimatedHours || ""
                                                    },
                                                    taxPercent: currentTeam.taxPercent || 0,
                                                    discountPercent: currentTeam.discountPercent || 0
                                                });
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveTeam}
                                        disabled={loading}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={<Users className="w-5 h-5" />}
                            label="Members"
                            value={`${members.length}/3`}
                            color="primary"
                        />
                        <StatCard
                            icon={<Clock className="w-5 h-5" />}
                            label="Billing Period"
                            value={teamData.billingPeriod || "Hourly"}
                            color="blue"
                        />
                        <StatCard
                            icon={<DollarSign className="w-5 h-5" />}
                            label="Subtotal"
                            value={`$${livePrice?.subtotal?.toFixed(2) || "0.00"}`}
                            color="green"
                            loading={pricingLoading}
                        />
                        <StatCard
                            icon={<TrendingUp className="w-5 h-5" />}
                            label="Total Budget"
                            value={`$${livePrice?.total?.toFixed(2) || "0.00"}`}
                            color="purple"
                            loading={pricingLoading}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Section
                            title="Team Members"
                            icon={<Users className="w-5 h-5" />}
                            action={
                                canAddMembers && (
                                    <button
                                        onClick={() => setShowAddMember(true)}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Member
                                    </button>
                                )
                            }
                        >
                            {!canAddMembers && (
                                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-yellow-400 text-sm">
                                        Team is full (3/3 members). Remove a member to add new ones.
                                    </p>
                                </div>
                            )}

                            {members.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">No members yet</h3>
                                    <p className="text-gray-400 mb-4">Add consultants to your team</p>
                                    <button
                                        onClick={() => setShowAddMember(true)}
                                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add First Member
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {members.map((member) => (
                                        <MemberCard
                                            key={member.consultant._id}
                                            member={member}
                                            onEdit={() => setEditingMember(member)}
                                            onRemove={() => handleRemoveMember(member.consultant._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Section>

                        {editMode && (
                            <Section title="Project Settings" icon={<Settings className="w-5 h-5" />}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Billing Period
                                        </label>
                                        <select
                                            value={teamData.billingPeriod}
                                            onChange={(e) => setTeamData(prev => ({ ...prev, billingPeriod: e.target.value }))}
                                            className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                        >
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>

                                    {teamData.billingPeriod === "hourly" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Estimated Hours
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={teamData.projectDuration.estimatedHours}
                                                onChange={(e) => setTeamData(prev => ({
                                                    ...prev,
                                                    projectDuration: { ...prev.projectDuration, estimatedHours: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                                placeholder="e.g., 160"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={teamData.projectDuration.startDate}
                                                onChange={(e) => setTeamData(prev => ({
                                                    ...prev,
                                                    projectDuration: { ...prev.projectDuration, startDate: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={teamData.projectDuration.endDate}
                                                onChange={(e) => setTeamData(prev => ({
                                                    ...prev,
                                                    projectDuration: { ...prev.projectDuration, endDate: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        )}
                    </div>

                    <div className="space-y-6">
                        <PricingCard
                            pricing={livePrice}
                            taxPercent={teamData.taxPercent}
                            discountPercent={teamData.discountPercent}
                            onTaxChange={(value) => setTeamData(prev => ({ ...prev, taxPercent: value }))}
                            onDiscountChange={(value) => setTeamData(prev => ({ ...prev, discountPercent: value }))}
                            editMode={editMode}
                            loading={pricingLoading}
                        />
                    </div>
                </div>
            </div>

            {showAddMember && (
                <AddMemberModal
                    teamId={teamId}
                    isOpen={showAddMember}
                    onClose={handleModalClose}
                />
            )}

            {editingMember && (
                <EditMemberModal
                    teamId={teamId}
                    member={editingMember}
                    isOpen={!!editingMember}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

function Section({ title, icon, action, children }) {
    return (
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#121212]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {icon}
                    </div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                </div>
                {action}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function StatCard({ icon, label, value, color = "primary", loading = false }) {
    const colorClasses = {
        primary: "text-primary bg-primary/10",
        green: "text-green-400 bg-green-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10"
    };

    return (
        <div className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {loading ? (
                <div className="h-7 bg-gray-800 rounded animate-pulse w-20"></div>
            ) : (
                <p className="text-lg font-bold text-white capitalize">{value}</p>
            )}
        </div>
    );
}

function MemberCard({ member, onEdit, onRemove }) {
    const consultant = member.consultant;

    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="p-4 bg-[#0d0d0d] rounded-xl border border-gray-800 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {getInitials(consultant.user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-1">
                        {consultant.user?.name || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">{member.role || consultant.title || "Consultant"}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        {consultant.baseRate?.hourly && (
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${consultant.baseRate.hourly}/hr
                            </span>
                        )}
                        {member.allocation && (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {member.allocation}% allocation
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRemove}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function PricingCard({ pricing, taxPercent, discountPercent, onTaxChange, onDiscountChange, editMode, loading }) {
    return (
        <Section title="Live Pricing" icon={<DollarSign className="w-5 h-5" />}>
            <div className="space-y-4">
                {editMode && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tax (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={taxPercent}
                                onChange={(e) => onTaxChange(e.target.value)}
                                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={discountPercent}
                                onChange={(e) => onDiscountChange(e.target.value)}
                                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="border-t border-gray-800 pt-4"></div>
                    </>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-6 bg-gray-800 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <PriceRow label="Subtotal" value={pricing?.subtotal || 0} />
                        {pricing?.discount > 0 && (
                            <PriceRow label="Discount" value={-pricing.discount} isDiscount />
                        )}
                        {pricing?.tax > 0 && (
                            <PriceRow label="Tax" value={pricing.tax} />
                        )}
                        <div className="border-t border-gray-700 pt-3 mt-3">
                            <PriceRow
                                label="Total"
                                value={pricing?.total || 0}
                                isTotal
                                currency={pricing?.currency}
                            />
                        </div>
                    </div>
                )}

                {!editMode && pricing && !loading && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-gray-400 text-center">
                            Pricing updates automatically based on team changes
                        </p>
                    </div>
                )}
            </div>
        </Section>
    );
}

function PriceRow({ label, value, isDiscount, isTotal, currency = "USD" }) {
    return (
        <div className="flex items-center justify-between">
            <span className={`${isTotal ? "font-semibold text-white" : "text-gray-400"}`}>
                {label}
            </span>
            <span className={`font-mono ${isTotal ? "text-xl font-bold text-primary" : isDiscount ? "text-red-400" : "text-white"}`}>
                {isDiscount && value !== 0 && "-"}
                {currency} {Math.abs(value).toFixed(2)}
            </span>
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 mt-24">
            <div className="max-w-7xl mx-auto">
                <div className="h-8 w-32 bg-gray-800 rounded mb-6 animate-pulse"></div>
                <div className="bg-[#121212] border border-gray-800 rounded-2xl p-8 mb-6 animate-pulse">
                    <div className="h-10 bg-gray-800 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-800 rounded w-2/3 mb-6"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-800 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}