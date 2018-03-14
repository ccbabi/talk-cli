let option = {}

exports.get = key => option[key]

exports.set = vals => void (option = vals)
