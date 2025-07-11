const replaceObjId = (nameSchema) => {
    nameSchema.virtual('id').get( function(){
        return this._id.toHexString();
    });
    nameSchema.set('toJSON', {
        virtuals: true
    });
};

module.exports = replaceObjId