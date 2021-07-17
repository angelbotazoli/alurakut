import { SiteClient } from 'datocms-client'

// backend for frontend
// quando acessar o api/comunidades vai executar vai recebe o request e no response vai criar o registro no servidor
export default async function recebedorDeRequests(request, response) {

    if (request.method === 'POST') {
        const TOKEN = '3cb583f44bde8b3ea41a12138f86a1';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "975852", //ID no Model de "Communities" criado pelo Dato
            // title: "Comunidade de teste",
            // imageUrl: "https://github.com/angelbotazoli.png",
            // creatorSlug: "angelica"
            ...request.body //pegando de forma generica qualquer dado do formulario (payload vai no corpo) 
        })
        // console.log(TOKEN)
        console.log(registroCriado) //criado no servidor, nao vai aparecer na tela
        response.json(
            {
                dados: 'Alguem dado qualquer',
                registroCriado: registroCriado,
            })
        return
    }
    response.status(404).json({
        message: 'Ainda nao temos nada no GET, mas no POST tem!'
    })
}
