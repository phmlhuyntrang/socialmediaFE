import * as httpRequest from '../utils/httpRequest';

export const getComment = async () => {
    try {
        const res = await httpRequest.get(`report_comments/get`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getCommentId = async (id) => {
    try {
        const res = await httpRequest.get(`report_comments/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const changeApprove = async (id, approveState) => {
    try {
        const res = await httpRequest.put(`report_comments/id/${id}/${approveState}`);
        return res.status;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
