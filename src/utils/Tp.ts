import toast from 'react-hot-toast';


export const Tp = (text = "Transition Password do not match!") => {
    toast.error(text, {
        position: "top-center",
    });
    return null;
};


export const success = (text="Done!") => {
    const toastId = toast.loading("Processing...");

    setTimeout(() => {
        toast.dismiss(toastId); 
        toast.success(text, {
            id: toastId, 
            position: "top-center",
        });
    }, 1000); 
};
