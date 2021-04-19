export const catchAsync = func => {
    // eslint-disable-next-line
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}