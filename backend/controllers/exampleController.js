exports.handleLogic = async (req, res) => {
    // Example of how to get query param --> key=value
    const keyParam = req.query.key;
    res.status(200).json({
        "response": `Hello World! ${keyParam ? keyParam : "no param given"}`
    });
};