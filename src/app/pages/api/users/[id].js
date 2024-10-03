// src/pages/api/users/[id].js
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const user = await User.findById(id);
                if (!user) return res.status(404).json({ success: false });
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
                if (!user) return res.status(404).json({ success: false });
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                const deletedUser = await User.deleteOne({ _id: id });
                if (!deletedUser) return res.status(404).json({ success: false });
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
