"use client";
import { useState } from "react";
import { X, Users, FileText, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTeamSelection } from "@/context/TeamSelectionContext";

export default function CreateTeamModal({ isOpen, onClose }) {
    const router = useRouter();
    const { createTeam, loading } = useTeamSelection();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        billingPeriod: "hourly",
        requirements: {
            skills: [],
            minExperience: "",
            preferredTimezone: "",
            remote: "",
            maxHourlyRate: ""
        }
    });

    const [skillInput, setSkillInput] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequirementChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            requirements: {
                ...prev.requirements,
                [key]: value
            }
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.requirements.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: {
                    ...prev.requirements,
                    skills: [...prev.requirements.skills, skillInput.trim()]
                }
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            requirements: {
                ...prev.requirements,
                skills: prev.requirements.skills.filter(s => s !== skill)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const cleanRequirements = {
                skills: formData.requirements.skills.length > 0 ? formData.requirements.skills : undefined,
                minExperience: formData.requirements.minExperience ? Number(formData.requirements.minExperience) : undefined,
                preferredTimezone: formData.requirements.preferredTimezone || undefined,
                remote: formData.requirements.remote !== "" ? formData.requirements.remote === "true" : undefined,
                maxHourlyRate: formData.requirements.maxHourlyRate ? Number(formData.requirements.maxHourlyRate) : undefined
            };

            const payload = {
                name: formData.name,
                description: formData.description,
                billingPeriod: formData.billingPeriod,
                requirements: cleanRequirements
            };

            const newTeam = await createTeam(payload);
            onClose();
            router.push(`/teams/${newTeam._id}`);
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#121212] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Create New Team</h2>
                            <p className="text-sm text-gray-400">Build your dream team of consultants</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <FileText className="w-5 h-5" />
                            <h3 className="font-semibold">Basic Information</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Team Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Frontend Development Team"
                                className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe your team's goals and requirements..."
                                className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Billing Period
                            </label>
                            <select
                                name="billingPeriod"
                                value={formData.billingPeriod}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-primary">
                            <Settings className="w-5 h-5" />
                            <h3 className="font-semibold">Team Requirements (Optional)</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Required Skills
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., React, Node.js, Python"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Add
                                </button>
                            </div>
                            {formData.requirements.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {formData.requirements.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                        >
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Min. Experience (years)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 5"
                                    value={formData.requirements.minExperience}
                                    onChange={(e) => handleRequirementChange("minExperience", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Preferred Timezone
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., UTC, EST, PST"
                                    value={formData.requirements.preferredTimezone}
                                    onChange={(e) => handleRequirementChange("preferredTimezone", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Max. Hourly Rate ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 100"
                                    value={formData.requirements.maxHourlyRate}
                                    onChange={(e) => handleRequirementChange("maxHourlyRate", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Work Type
                                </label>
                                <select
                                    value={formData.requirements.remote}
                                    onChange={(e) => handleRequirementChange("remote", e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Any</option>
                                    <option value="true">Remote</option>
                                    <option value="false">On-site</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Users className="w-4 h-4" />
                                    Create Team
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}