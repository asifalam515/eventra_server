const sendResponse = (res, data) => {
    const { statusCode, success, message, data: dataResponse } = data;
    res.status(statusCode).json({
        success,
        data: dataResponse,
        message,
    });
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map