exports.validate = (schema) => {
    return async (req, res, next) => {
        try {
            let validationErr = [];
            ['body', 'params', 'query'].forEach((key) => {
                if (schema[key]) {
                    const validation = schema[key].validate(req[key])
                    if (validation.error) {
                        validationErr.push(validation.error)
                    }
                }
            })
            if (validationErr.length > 0) {
                // console.log(validationErr);
                res.status(400).json({ message: "validation error", validationErr: validationErr[0].details[0].message })
            } else {
                next()
            }
        } catch (error) {
            res.status(500).json({message:"server error", error})
        }
    }
}