const Timetable = require("../models/Timetable");

const timetableController = {
    // @desc Create timetable entry
    // @route POST /api/timetable/create
    createTimetable: async (req, res) => {
        try {
            const { class: classId, day, period, course } = req.body;

            if (!classId || !day || !period || !course) {
                return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
            }

            const timetable = await Timetable.create({
                class: classId,
                day,
                period,
                course,
            });

            res
                .status(201)
                .json({ success: true, message: "Timetable created", timetable });
        } catch (error) {
            console.error("Error creating timetable:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    // @desc Fetch timetable for a class
    // @route GET /api/timetable/class/:classId
    getTimetableByClass: async (req, res) => {
        try {
            const { classId } = req.params;

            const timetable = await Timetable.find({ class: classId })
                .populate("class")
                .populate("period")
                .populate({
                    path: "course",
                    populate: { path: "teacher", select: "name email" },
                })
                .sort({ day: 1 });

            res.status(200).json({ success: true, timetable });
        } catch (error) {
            console.error("Error fetching timetable:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    // @desc Delete timetable entry
    // @route DELETE /api/timetable/:id
    deleteTimetable: async (req, res) => {
        try {
            const { id } = req.params;
            await Timetable.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: "Timetable deleted" });
        } catch (error) {
            console.error("Error deleting timetable:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },
};

module.exports = timetableController;
