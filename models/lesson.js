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
                ref: 'User'
            },
            name: {
                type: String
            }
        }
    ]
});

lessonSchema.methods.reserveSlot = function(userId){
    
    const updatedParticipants = [...this.participants];
    //controllo se l'utente loggato ha gia prenotato un posto
    if(this.participants.find(part => part.userId && part.userId.toString() === userId.toString())){
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

lessonSchema.methods.cancelSlot = function(userId){
    let updatedParticipants = [...this.participants];
    //controllo se l'utente loggato ha gia prenotato un posto
    if(this.participants.find(part => part.userId && part.userId.toString() === userId.toString())){
        updatedParticipants = updatedParticipants.filter(val => {
            if(!val.userId){
                return true;
            }
            return val.userId.toString() !== userId.toString();
        });
    }else{
        console.log('Hai gia prenotato questa pratica.');
        return false;
    }
    this.participants = updatedParticipants;
    return this.save();
}

lessonSchema.methods.reserveAnonymSlot = function(name){
    
    const updatedParticipants = [...this.participants];
    updatedParticipants.push({
        name: name
    });
    this.participants = updatedParticipants;
    return this.save();
}

module.exports = mongoose.model('Lesson', lessonSchema);