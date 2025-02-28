const callStudent = async () => {
    const phoneNumber = "+918248531725"; 
    // const phoneNumber = "+918072727965";

    try {
        const response = await fetch("http://localhost:3001/call-student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Call initiated successfully!");
        } else {
            alert("Call failed: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while making the call.");
    }
    return(
        <button onClick={callStudent}>Call Student</button>
    );
};
export default callStudent;

// Button in React component
