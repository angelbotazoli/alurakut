import React from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/componentes/MainGrid'
import Box from '../src/componentes/Box'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons' //usando apenas uma determinada funcao exportada da lib
import { ProfileRelationsBoxWrapper } from '../src/componentes/ProfileRelations'

function ProfileSideBar(propriedades) { //utilizando as props
  console.log(propriedades);

  return (
    // transformando a div em tag side,semanticamente é uma sidebar e visualmente é uam div
    < Box as="aside" >
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box >
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          console.log("seguidores", itemAtual.login)

          return (
            < li key={itemAtual} >
              <a href={`https://github.com/${itemAtual.login}.png`}>
                <img src={`${itemAtual.html_url}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper >
  )
}

export default function Home(props) {
  // const user = 'angelbotazoli';
  const user = props.githubUser;

  // const comunidades =['Alurakut']
  // const [comunidades, setComunidades] = React.useState(['Alurakut']) //Hooks são os uses, retorna o valor do atributo e retorna a forma como podemos altera-lo (tipo get e set)

  const [comunidades, setComunidades] = React.useState([]);

  // retornos do react
  // const comunidades = comunidades[0]
  // const alteracomunidades/setComunidades =comunidades[1]
  console.log(comunidades)

  const favoritePeople = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho', 'filipedeschamps']

  // 0 - pegar o array de dados do github
  // const seguidores = fetch("https://api.github.com/users/peas/followers")
  //   .then(function (respostaDoServidor) {
  //     return respostaDoServidor.json();
  //   })
  //   .then(function (respostaCompleta) {
  //     console.log(respostaCompleta)
  //   })

  const [seguidores, setSeguidores] = React.useState([]);

  // useEffect sempre executa uma funcao, executa sempre que alguma coisa é alterada na tela
  React.useEffect(function () {
    // GET implicito
    fetch("https://api.github.com/users/peas/followers")
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        console.log(respostaCompleta)
        setSeguidores(respostaCompleta)
      })

    // API GrapQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '9ea802086faba3d33379b7bd2021ee',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `query {
        allCommunities{
          title
          id
          imageUrl
          creatorSlug
        }
      }` })

    })
      .then((response) => response.json()) // pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities
        console.log(comunidadesVindasDoDato)

        setComunidades(comunidadesVindasDoDato)
      })
  }, [])//[] define quantas vezes vai ser executado

  // 1-criar um box que vai ter um map, baseado nos items do array que pegamos do github



  //para utilizar js ou css dentro do html é necessario usar o {} do React
  //o fragment <></> serve para englobar as tags que não podem ser duplicadas (é um div de mentira)
  //para React se utiliza muito o map no lugar no foreach pois o map transforma um array e nos retorna o dado transformado
  return (
    <>
      <AlurakutMenu githubUser={user} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={user} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box >
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box >
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault() //barrando o refresh da pagina
              console.log(e)

              const dadosDoForm = new FormData(e.target);//transforma os dados do formulario e traz no retorna
              console.log(dadosDoForm.get('title'))

              const comunidade = {
                // id: new Date().toISOString(),
                // title: dadosDoForm.get('title'),
                // image: dadosDoForm.get('image')
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: user
              }

              //escondendo o Dato, batendo direto na nossa url. Chamando o servidor do next que esta rodando
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado)
                  const comunidade = dados.registroCriado

                  // comunidades.push('Alura Stars')
                  const comunidadesAtualizadas = [...comunidades, comunidade]//spread
                  setComunidades(comunidadesAtualizadas)
                  // console.log(comunidadesAtualizadas)
                })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/comunidades/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoritePeople.length})
            </h2>
            <ul>
              {favoritePeople.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

//usuário manda a requisição, antes do conteúdo HTML ser gerado e enviado para o navegador, conseguimos validar se ele está logado ou não
export async function getServerSideProps(context) {
  // console.log("token", nookies.get(context).USER_TOKEN)
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN //retorna token salvo no cookies

  //decofida o cookies
  console.log('teste', jwt.decode(token))


  // //valida token (usuario valido no github)
  // const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
  //   headers: {
  //     Authorization: token
  //   }
  // })
  //   .then((resposta) => resposta.json())
  // // .then((resultado) => {
  // //   console.log(resultado)
  // //   // console.log(isAuthenticated)
  // // })

  //valida token (usuario valido no github) 
  const { isAuthenticated } = await fetch("https://alurakut-nu-dun.vercel.app/api/auth", {// http://localhost:3000/api/auth
    headers: {
      Authorization: token,
    },
  })
    .then((resposta) => resposta.json())
  console.log("Esta autenticado: ", isAuthenticated)

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);//o nome do ultimo parametro vai ser o nome da variavel (destruct)
  return {
    props: {
      // githubUser: 'angelbotazoli'
      githubUser
    },
  }
}
