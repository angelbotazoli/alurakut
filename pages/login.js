import React from 'react';
// Hook do NextJS
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('');

  //no atributo value vinculamos o campo que esta sendo criado com o estado que esta sendo feito do React 
  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(infosDoEvento) => { //default é enviar para a própria pagina por meio do atributo action que esta implicitamente no form
            infosDoEvento.preventDefault()//barrando o evento padrao de enviar o formulario
            console.log('usuario', githubUser)



            fetch('https://alurakut.vercel.app/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              // body: JSON.stringify({ githubUser: 'angelbotazoli' })
              body: JSON.stringify({ githubUser: githubUser })
            })
              .then(async (respostaDoServer) => {
                const dadosDaResposta = await respostaDoServer.json()
                console.log(dadosDaResposta.token)
                const token = dadosDaResposta.token
                //cookies
                nookies.set(null, 'USER_TOKEN', token, {
                  path: '/',
                  maxAge: 86400
                })
                router.push('/') // empilhando um nosso acesso no historico do nagevador
              })


          }}>
            <p>Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!</p>
            <input placeholder="Usuário" value={githubUser} onChange={(evento) => {
              setGithubUser(evento.target.value) //target é o elemento que estamos usando
            }} />

            {githubUser.length === 0 ? 'Preencha o campo' : ''}

            <button type="submit">Login</button>
          </form>
          <footer className="box">
            <p>Ainda não é membro?<br />
              <a href="/login"><strong>ENTRAR JÁ</strong></a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
} 