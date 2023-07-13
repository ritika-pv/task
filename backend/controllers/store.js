exports.order = async (req, res) => {
    try { 
        const{pet_id,quantity} = req.body;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}