import { User } from "source/models/user";

interface LoginResponse {
    access_token: string; 
    token_type: string; 
}

export const apiFetchToken = async (email: string, password: string): Promise<{ user: User; access_token: string }> => {
    try {
        // Hacemos la solicitud POST a la API
        const response = await fetch('https://api-2ro3.onrender.com/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la autenticación');
        }

        const data: LoginResponse = await response.json();
        console.log(data); // Aquí verás la respuesta de la API
        
        // Retornamos los datos incluyendo el usuario mockeado
        const user: User = {
            name: 'Demo Usuario',
            email: 'PATENTE',
            token: data.access_token,
            id: ""
        };

        return { user, access_token: data.access_token };

    } catch (error) {
        // Manejo de errores
        throw new Error(error instanceof Error ? error.message : 'Error en la autenticación');
    }
};
