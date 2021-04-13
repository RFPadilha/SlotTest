# SlotTest
Small slot machine game for Wild Rose test.

## Sexta-Feira - 9/04/2021
- 17:28 - Recebido o repositório no bitbucket
- 20:17 - Término das instalações

## Segunda-Feira - 12/04/2021
- 16:13 - Analisando e comentando o código
- 16:48 - Início da implementação de pattern recognition
  
  -- Tentativa de reconhecer tile a tile
  
  -- Tentativa de forçar parada dos reels
- 20:08 - Término das atividades:
  
  -- Detecção de 1 linha com mesmos símbolos alcançada, porém de maneira ineficiente
  
  -- Criando uma segunda máquina em cima da antiga
    - Muitos problemas surgiram aqui (performance, a animação de reel ainda tocava por trás da máquina nova)
    - de modo geral, uma solução ruim

## Terça-Feira - 13/04/2021
- 10:02 - Continuação das implementações
- 11:00 - Alcançado maneira mais eficaz de reconhecer uma linha com os mesmos símbolos
 
 -- Sincronizada a velocidade e direção dos reels
 
 -- Ao parar, define uma linha de tiles para receber imagens iguais
- 11:37 - Condições de vitória definidas
  
  -- 50% de chance de perda
 
  -- 33% de chance de vitória de 1 linha
  
  -- 10% de chande de vitória com 2 linhas
  
  -- 7% de chande de vitória com 3 linhas
 
  -- Interrupção das atividades
- 17:40 - Continuação das implementações
 
  -- Resta a animação de brilho quando os tiles são iguais na linha
- 19:23 - Terminada a animação de brilho
 
  -- Cada nodo de Tile possui um nodo filho, onde a animação está guardada
 
  -- Animação somente altera a opacidade do brilho do tile em loop
 
  -- Animação cessa quando a máquina gira novamente
- 19:53 - Término da implementação, envio ao GitHub
