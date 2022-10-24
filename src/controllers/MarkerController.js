const Marker = require('../models/Marker');

class MarkerController {
    static async index(req, res) {
        try {
            const { user } = req;
    
            const markers = await Marker.find({ user: user._id });
    
            res.status(200).json({ success: true, markers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async show(req, res) {
        const { user } = req;
        const { id } = req.params;

        const marker = await Marker.findOne({ _id: id, user: user._id });

        if (!marker) return res.status(404).json({ success: false, message: 'Marker not found' });

        res.status(200).json({ success: true, marker });
    }

    static async store(req, res) {
        const { user } = req;

        const { name, description, latitude, longitude } = req.body;

        const lat = String(latitude);
        const lng = String(longitude);

        const marker = new Marker({
            name,
            description,
            latitude: lat,
            longitude: lng,
            user: user._id,
        });

        try {
            await marker.save();

            res.status(201).json({ success: true, message: 'Marker created', marker });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { name, description, latitude, longitude } = req.body;

        const marker = await Marker.findById(id);
        
        if (!marker) return res.status(404).json({ success: false, message: 'Marker not found' });

        marker.name = name;
        marker.description = description;
        marker.latitude = latitude;
        marker.longitude = longitude;

        try {
            await marker.save();

            res.status(200).json({ success: true, message: 'Marker updated', marker });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    static async destroy(req, res) {
        const { user } = req;
        const { id } = req.params;

        const marker = await Marker.findOneAndDelete({ _id: id, user: user._id });

        if (!marker) return res.status(404).json({ success: false, message: 'Marker not found' });

        res.status(200).json({ success: true, message: 'Marker deleted' });
    }
}

module.exports = MarkerController;