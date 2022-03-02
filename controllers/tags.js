import { ApiTag } from '../api/tags.js';

export class ControllerTag {

    constructor() {
        this.apiTag = new ApiTag();
    }

    createTag = async (req, res) => {
        try {
            const tag = req.body;
            const created = await this.apiTag.createTag(tag);
            if (created) {
                return res.status(200).json(created);
            } else {
                return res.status(500).json(created);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getTag = async (req, res) => {
        try {
            const { tag } = req.params;
            const resultado = await this.apiTag.getTag(tag);
            if (resultado) {
                return res.status(200).json(resultado);
            } else {
                return res.status(500).json(resultado);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
