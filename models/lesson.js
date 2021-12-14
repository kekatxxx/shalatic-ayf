const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    maxSlots: {
        type: Number
    },
    participants: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
});

lessonSchema.methods.reserveSlot = function(userId){
    const updatedParticipants = [...this.participants];
    //controllo se l'utente loggato ha gia prenotato un posto
    if(this.participants.find(user => user.userId.toString() === userId.toString())){
        console.log('Hai gia prenotato questa pratica.');
        return false;
    }else{
        updatedParticipants.push({
            userId: userId
        });
    }
    this.participants = updatedParticipants;
    return this.save();
}

module.exports = mongoose.model('Lesson', lessonSchema);