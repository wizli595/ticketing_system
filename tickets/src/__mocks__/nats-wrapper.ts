export const natsWrapper = {
    client: {
        publish: jest.fn((subject, data, callback) => {
            console.log("Publish mock called");
            callback();
        }),
    },
}
