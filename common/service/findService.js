const findService = async (model, skip, limit, populateList, search, fields) => {
    try {
        let data;
        if (search) {
            const columns = [
                ...fields.map((field) => {
                    return {
                        [field]: { $regex: search }
                    }
                })
            ]
            return data = await model.find({ $or: columns }).skip(skip).limit(limit).populate(populateList)
        } else {
            return data = await model.find({}).skip(skip).limit(limit).populate(populateList)
        }
    } catch (error) {
        return error
    }
}
module.exports = { findService }