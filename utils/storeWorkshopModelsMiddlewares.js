import { counterModel } from "../model/models/CounterModel.js";

export const sequentialIdMiddleware = (schema, modelName) => {

    schema.pre('save', async function (next) {
        if (this.isNew) {
            const counter = await counterModel.findOneAndUpdate(
                { model: modelName },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );
            this.id = counter.count;
        }
        next();
    })
}

export const deleteWorkshopsMiddleware = (schema, storeWorkshopModel, action) => {
    schema.pre('remove', async function (next) {
        try {
            const actionMap = {
                'storeWorkshopType': () => storeWorkshopModel.deleteMany({ eqType: this.id }),
                'storeWorkshopUbication': () => storeWorkshopModel.deleteMany({ storeWorkshopUbication: this.id })
            }
            if (actionMap[action]) await actionMap[action]();
            next();
        } catch (error) {
            next(error);
        }
    })
}