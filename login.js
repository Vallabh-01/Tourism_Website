document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('Login form submitted:', { email, password });

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.status === 200) {
        console.log('Login successful:', result);
        window.location.href = '/index.html';
    } else {
        console.log('Login failed:', result.message);
        alert(result.message);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    console.log('Signup form submitted:', { name, email, password });

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (response.status === 201) {
        console.log('Signup successful:', result);
        alert(result.message);
    } else {
        console.log('Signup failed:', result.message);
        alert(result.message);
    }
});
