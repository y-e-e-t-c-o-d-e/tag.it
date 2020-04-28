exports.handleLogic = async (req, res) => {
    // Example of how to get query param --> key=value
    const keyParam = req.query.key;
    res.send('Hello World! key=' + keyParam);
};