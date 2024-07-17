import mongoose from 'mongoose';

const CounterModelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
});

export const counterModel = mongoose.model('counters', CounterModelSchema);
