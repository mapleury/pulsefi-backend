exports.getOpportunities = (req, res) => {
    // This acts as a curated database for Gen Z
    const opportunities = [
        {
            id: 1,
            title: "Google for Startups",
            category: "Program",
            description: "Mentorship and credits for tech founders.",
            link: "https://startups.google.com"
        },
        {
            id: 2,
            title: "Sequoia Spark",
            category: "Internship/Equity",
            description: "Program for early-stage female founders and developers.",
            link: "https://www.sequoiacap.com"
        },
        {
            id: 3,
            title: "Djarum Beasiswa Plus",
            category: "Scholarship",
            description: "Soft skills training and financial support for students.",
            link: "https://djarumbeasiswaplus.org"
        }
    ];

    res.json({
        hub_name: "PulseFi Opportunity Hub",
        total_found: opportunities.length,
        items: opportunities
    });
};