/**
 * restore-damaged-posts.ts
 *
 * Restaura os 13 posts cujo conteúdo foi truncado pela migração anterior.
 * O conteúdo foi recuperado diretamente do banco MySQL do WordPress original.
 *
 * O conteúdo salvo aqui é o HTML RAW do WordPress (com boilerplate).
 * O cleanWordPressContent em api.ts fará a limpeza em tempo de exibição.
 *
 * Uso:
 *   npx tsx --env-file=.env.local src/scripts/restore-damaged-posts.ts          ← dry run
 *   npx tsx --env-file=.env.local src/scripts/restore-damaged-posts.ts --save   ← salva
 */

import dbConnect from '../lib/mongodb';
import { Post } from '../models/Post';

const DRY_RUN = !process.argv.includes('--save');

// ── Conteúdo original recuperado do MySQL ─────────────────────────────────────

const POSTS: Record<string, string> = {

    'aula-11-python-funcoes': `<h1>Python - Funções</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br" target="_blank" rel="noopener noreferrer">Voltar para página principal do blog</a></h3>
<h3><a href="https://www.codigofluente.com.br/algoritmo-linguagem-de-programacao/python/" target="_blank" rel="noopener noreferrer">Todas as aulas desse curso</a></h3>
<h3><a href="https://www.codigofluente.com.br/aula-10-python-tipo-bool-e-operadores/" target="_blank" rel="noopener noreferrer">Aula 10</a> <a href="https://www.codigofluente.com.br/aula-12-python-pydoc-documentacao/" target="_blank" rel="noopener noreferrer">Aula 12</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h1>Python - Funções</h1>
Uma função é um bloco de código que só é executado quando é chamado.

Você pode passar dados, conhecidos como parâmetros, para uma função.

Funções podem retornar dados (objetos) ou não como resultado.

Aceitam Doc Strings.

Doc Strings são strings que estão associadas a uma estrutura do Python ( <span style="color: #ff6600;">classe</span>, <span style="color: #ff6600;">método</span> ou <span style="color: #ff6600;">função</span>) e devem ser colocadas como a primeira linha da definição de qualquer uma dessas estruturas citadas em <span style="color: #ff6600;">laranja</span>.

O objetivo das Doc Strings é servir de documentação para aquela estrutura, seja uma classe, um método ou uma função.

Exemplo:
<pre><code>
def fatorial(n):
<span style="color: #ff6600;">"""Esta função retorna o fatorial de um número n"""</span>
    if n == 0 or n == 1:
        return 1 
    else:
        return n * fatorial(n - 1) 
</code></pre>
<h2>Criando uma Função</h2>
Em Python, uma função é definida usando a palavra-chave <span style="color: #ff6600;">def</span>:
<pre><code>
def minha_funcao():
    print ("Olá mundo!")
</code></pre>
<h2>Chamando uma Função</h2>
Para chamar uma função, use o nome da função seguido de parênteses:
<pre><code>minha_funcao() <span style="color: #008000;">#Saída: Olá mundo!</span></code></pre>
<h2>Parâmetros</h2>
Informações podem ser passadas para as funções como parâmetro.

Os parâmetros são especificados após o nome da função, dentro dos parênteses.

O exemplo a seguir tem uma função que recebe um parâmetro (<span style="color: #ff6600;">name</span>).
<pre><code>
def saudacao(name):
    print ("Olá " + name)</code></pre>
<pre><code>saudacao("Toti") <span style="color: #008000;">#Saída: Olá Toti</span></code></pre>
<h2>Valor do Parâmetro Padrão (Default Parameter Value)</h2>
<pre><code>
def nacionalidade(pais = "Brasil"):
    print("Eu nasci no(a)" + pais)

nacionalidade() <span style="color: #008000;">#Saída: Eu nasci no(a) Brasil!</span>
nacionalidade("França") <span style="color: #008000;">#Saída: Eu nasci no(a) França!</span>
</code></pre>
<h2>Retorno de função (Return Values)</h2>
<pre><code>
def multi_cinco(x):
  return 5 * x

print(multi_cinco(3))
print(multi_cinco(5))
print(multi_cinco(9))
</code></pre>
<h2>Recursão</h2>
O Python também aceita recursividade na chamada de funções.
<pre><code>
def fatorial(n):
    if n == 0 or n == 1:
        return 1 
    else:
        return n * fatorial(n - 1) 
</code></pre>
<h3>Com isso encerramos mais essa aula. :)</h3>`,

    'aula-09-python-matriz-esparsa': `<h1>Python - Matriz Esparsa</h1>
<h2>MATRIZ ESPARSA EM PYTHON</h2>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-08-python-dicionario/" target="_blank" rel="noopener noreferrer">Aula 08</a> <a href="https://www.codigofluente.com.br/aula-10-python-tipo-bool-e-operadores/" target="_blank" rel="noopener noreferrer">Aula 10</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h1>Python - Matriz Esparsa</h1>
Uma matriz é esparsa quando possui uma grande quantidade de elementos que valem zero, ou não estão presentes, ou ainda, não são necessários.

É implementada através de um conjunto de listas ligadas que apontam para elementos diferentes de zero.

Matrizes esparsas têm aplicações em problemas de engenharia, física e simulação.
<pre><code>
dim = 6, 12
mat = {}
mat[3, 7] = 2
mat[4, 6] = 9
mat[6, 3] = 8
mat[5, 4] = 3
mat[2, 9] = 4
mat[1, 0] = 7
for lin in range(dim[0]):
    for col in range(dim[1]):
        if(col== dim[1] - 1):
            print(mat.get((lin, col), 0), )
        else:
            print(mat.get((lin, col), 0), end=" ")
</code></pre>
<h3>A saída será:</h3>
<span style="color: #008000;">0 0 0 0 0 0 0 0 0 0 0 0</span>
<span style="color: #008000;">7 0 0 0 0 0 0 0 0 0 0 0</span>
<span style="color: #008000;">0 0 0 0 0 0 0 0 0 4 0 0</span>
<span style="color: #008000;">0 0 0 0 0 0 0 2 0 0 0 0</span>
<span style="color: #008000;">0 0 0 0 0 0 9 0 0 0 0 0</span>
<span style="color: #008000;">0 0 0 0 3 0 0 0 0 0 0 0</span>
<h2>É isso, ficamos por aqui, até a próxima. :)</h2>`,

    'aula-12-python-pydoc-documentacao': `<h1>Python - PyDOC - Documentação.</h1>
<h2>Pydoc é um módulo que gera automaticamente a documentação dos módulos do Python.</h2>
<h2>Que fazer esse curso com certificação?</h2>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-11-python-funcoes/" target="_blank" rel="noopener noreferrer">Aula 11</a> <a href="https://www.codigofluente.com.br/aula-13-python-modules-modulos/" target="_blank" rel="noopener noreferrer">Aula 13</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>PyDOC é portanto, utilizado para documentar códigos Python.</h2>
Pode ser utilizado para acessar a documentação dos módulos que acompanham o Python e também a documentação de outros módulos.

Para módulos, classes, funções e métodos, a documentação exibida é derivada da <strong>docstring</strong> (ou seja, o atributo <strong>__doc__</strong>) do objeto e recursivamente de seus membros documentáveis.

A função interna <strong>help ()</strong> chama o sistema de ajuda on-line no interpretador interativo, que usa o pydoc para gerar sua documentação como texto no console.

Execute no linux: <code>pydoc sys</code>

Ou no cmd do windows: <code>python -m pydoc sys</code>

Especificar um sinalizador <strong>-w</strong> antes do argumento fará com que a documentação em HTML seja gravada em um arquivo no diretório atual.

Você também pode usar o pydoc para iniciar um servidor HTTP na máquina local.

O <code>pydoc -p 1234</code> iniciará um servidor HTTP na porta 1234.

No windows use: <code>python -m pydoc -p 1234</code>
<h3>Resumindo:</h3>
Módulo <strong>Pydoc</strong> em Python é usado para gerar documentação na forma de páginas <strong>html</strong> ou até mesmo no <strong>console</strong>.

<code>python -m pydoc -w arquivo</code>
<pre><code>"""
Este módulo de exemplo mostra vários tipos de documentação disponíveis para uso
com pydoc.
"""

class Pessoa(object):
    """
    encapsula um nome e uma idade.
    """
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade

def ImprimeSaudacao(saudacao):
    """
    Imprime saudacao no visor.
    """
    print(saudacao)

if __name__ == '__main__':
    p = Pessoa('Fulano de Tal', 70)
    ImprimeSaudacao("Olá, seja bem-vindo.")</code></pre>
<h2>Com isso encerramos mais essa aula. :)</h2>`,

    'aula-10-python-tipo-bool-e-operadores': `<h1>Python - Verdadeiro, falso, nulo e operadores booleanos em python</h1>
<h2>True, False, Null e Operadores Booleanos em python</h2>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-09-python-matriz-esparsa/" target="_blank" rel="noopener noreferrer">Aula 09</a> <a href="https://www.codigofluente.com.br/aula-11-python-funcoes/" target="_blank" rel="noopener noreferrer">Aula 11</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h1>Python - Verdadeiro, falso, nulo e operadores booleanos em python</h1>
Em Python, o tipo booleano (<span style="color: #ff6600;">bool</span>) é uma especialização do tipo inteiro (<span style="color: #ff6600;">int</span>).

O verdadeiro é chamado de <span style="color: #ff6600;">True</span> e é igual a <span style="color: #ff6600;">1</span> e o falso é chamado de <span style="color: #ff6600;">False</span> e é igual a <span style="color: #ff6600;">zero</span>.
<h3>Os valores abaixo são considerados falsos:</h3>
<ul>
<li><span style="color: #ff6600;">False</span></li>
<li><span style="color: #ff6600;">None</span></li>
<li><span style="color: #ff6600;">0</span></li>
<li><span style="color: #ff6600;">''</span> (string vazia)</li>
<li><span style="color: #ff6600;">[]</span> (lista vazia)</li>
<li><span style="color: #ff6600;">()</span> (tupla vazia)</li>
<li><span style="color: #ff6600;">{}</span> (dicionário vazio)</li>
</ul>
<h2>Operadores booleanos</h2>
Com operadores lógicos (booleanos) é possível construir condições mais complexas.
<h3>Os operadores booleanos no Python são: <span style="color: #ff6600;">and</span>, <span style="color: #ff6600;">or</span>, <span style="color: #ff6600;">not</span>, <span style="color: #ff6600;">is</span> e <span style="color: #ff6600;">in</span>.</h3>
<pre><code>
print(0 and 3) <span style="color: #008000;"># Saída 0</span>
print(2 and 5) <span style="color: #008000;"># Saída 5</span>
print(0 or 3) <span style="color: #008000;"># Saída 3</span>
print(2 or 3) <span style="color: #008000;"># Saída 2</span>
print(not 0) <span style="color: #008000;"># Saída True</span>
print(not 2) <span style="color: #008000;"># Saída False</span>
print(2 in (2, 3)) <span style="color: #008000;"># Saída True</span>
print(2 is 3) <span style="color: #008000;"># Saída False</span>
</code></pre>
<h3>Com isso encerramos mais essa aula. :)</h3>`,

    'aula-08-python-dicionario': `<h1>Aula 08 - Python - Dicionário</h1>
<h2>COMO UTILIZAR DICIONÁRIO EM PYTHON</h2>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/set-frozenset-range-python/" target="_blank" rel="noopener noreferrer">Aula 07</a> <a href="https://www.codigofluente.com.br/aula-09-python-matriz-esparsa/" target="_blank" rel="noopener noreferrer">Aula 09</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Aula 08 - Python - Dicionário</h2>
<h3>DICIONÁRIO</h3>
<ul>
<li>Um dicionário é uma lista de associações compostas por uma chave única e seu respectivo valor</li>
<li>Dicionários são mutáveis, como as listas</li>
<li>A chave precisa ser de um tipo imutável, normalmente strings.</li>
</ul>

<code><span style="color: #0000ff;">dc01 = {"nome": "Maria", "profissão": "médica"}</span></code>

Acessando itens: <code><span style="color: #0000ff;">dc01['nome']</span></code> → <code><span style="color: #008000;">Maria</span></code>

Adicionando itens: <code><span style="color: #0000ff;">dc01['CPF'] = '362378933-20'</span></code>

Deletando itens: <code><span style="color: #0000ff;">del dc01['CPF']</span></code>

Obtendo itens: <code><span style="color: #0000ff;">dc01.items()</span></code>

Obtendo chaves: <code><span style="color: #0000ff;">dc01.keys()</span></code>

Obtendo valores: <code><span style="color: #0000ff;">dc01.values()</span></code>
<pre><code><span style="color: #0000ff;">carros = {'Ford': ['KA', 'Fiesta'], 'Chevrolet': ['Camaro', 'Onix']}
for marca, modelo in carros.items():
    print(marca, ' => ', modelo)
</span></code></pre>
<h3>Com isso encerramos essa aula.</h3>`,

    'aula-14-python-pacotes-packages': `<h1>Pacotes ou python packages</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-13-python-modules-modulos/" target="_blank" rel="noopener noreferrer">Aula 13</a> <a href="https://www.codigofluente.com.br/aula-15-python-orientacao-a-objeto-01/" target="_blank" rel="noopener noreferrer">Aula 15</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Agora vamos entender o que são pacotes.</h2>
Pacotes são módulos também. Eles são apenas embalados de forma diferente.

Eles são formados pela combinação de um diretório mais o arquivo <span style="color: #008000;"><strong>__init__.py</strong></span>.

Pacotes são identificados pelo interpretador pela presença de um arquivo com o nome "<span style="color: #008000;"><strong>__init__.py</strong></span>".
<pre><strong>parent_directory/
    main.py
    ecommerce/
        __init__.py
        database.py
        products.py
        payments/
            __init__.py
            paypal.py
            authorizenet.py
</strong></pre>
<pre><code>
"""Módulo principal."""
import ecommerce.products
from ecommerce.payments.paypal import PayPal

def main():
    product = ecommerce.products.Product()
    print(product)
    PayPal()

if __name__ == "__main__":
    main()
</code></pre>
<h3>É isso, na próxima aula veremos a biblioteca padrão do python.</h3>`,

    'aula-17-python-geradores-yield': `<h1>Python - Geradores ( yield )</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-16-python-orientacao-a-objetos-02/" target="_blank" rel="noopener noreferrer">Aula 16</a> <a href="https://www.codigofluente.com.br/aula-18-programacao-funcional-em-python/" target="_blank" rel="noopener noreferrer">Próxima 18</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h1>Seguindo ;)</h1>
<h2>Geradores</h2>
As <strong>funções</strong> geralmente seguem o seguinte fluxo: processar, retornar valores, encerrar.

Geradores funcionam parecido, eles lembram o estado do processamento entre as chamadas.

Os <strong>geradores</strong> apresentam várias vantagens:
<ol>
<li>Lazy Evaluation: geradores só são processados quando é realmente necessário;</li>
<li>Reduzem a necessidade da criação de listas;</li>
<li>Permitem trabalhar com sequências ilimitadas de elementos;</li>
</ol>
<pre><code>
def numbers_yield(max_n):
    for n in range(max_n + 1):
        yield n
</code></pre>
<pre><code>
def years_generator(start = 1, end = 5000):
    for year in range(start, end + 1):
        yield year
</code></pre>
<h2>Valeu pessoal, nos vemos na próxima aula.  🖖</h2>`,

    'aula-18-programacao-funcional-em-python': `<h1>Aula 18 - Python - Programação funcional</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-17-python-geradores-yield/" target="_blank" rel="noopener noreferrer">Aula 17</a> <a href="https://www.codigofluente.com.br/aula-19-python-biblioteca-padrao-modulo-math/" target="_blank" rel="noopener noreferrer">Aula 19</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Seguindo ;)</h2>
<h2>Programação funcional em python</h2>
De acordo com o <a href="https://en.wikipedia.org/wiki/Functional_programming">wikipedia</a>, <strong>programação funcional</strong> é um paradigma de programação que trata a computação como a avaliação de funções matemáticas e evita a mudança de estado e dados mutáveis.

Essas funções são chamadas de <strong>pure function</strong>, ou <strong>função pura</strong>.
<h2>Lambda</h2>
As <strong>funções lambda</strong> podem ter qualquer número de argumentos, mas, apenas uma expressão.
<pre><code>
dobro = lambda x: x * 2
print(dobro(5)) # Saída: 10
</code></pre>
<h2>Exemplo de uso com <strong>filter()</strong></h2>
<pre><code>
lst = [1, 5, 4, 6, 8, 11, 3, 12]
new_lst = list(filter(lambda x: (x % 2 == 0) , lst))
print(new_lst) # [4, 6, 8, 12]
</code></pre>
<h2>Exemplo de uso com <strong>map()</strong></h2>
<pre><code>
lst = [1, 5, 4, 6, 8, 11, 3, 12]
new_lst = list(map(lambda x: x * 2 , lst))
print(new_lst) # [2, 10, 8, 12, 16, 22, 6, 24]
</code></pre>
<h2>List Comprehension</h2>
<pre><code>
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
print([ x**2 for x in nums if x % 2 ])
# [1, 9, 25, 49, 81, 121]
</code></pre>
<h2>Por hora ficamos por aqui, nos vemos na próxima aula.  🖖</h2>`,

    'aula-16-python-orientacao-a-objetos-02': `<h1>Programação orientada a objetos - continuação</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-15-python-orientacao-a-objeto-01/" target="_blank" rel="noopener noreferrer">Aula 15</a> <a href="https://www.codigofluente.com.br/aula-17-python-geradores-yield/" target="_blank" rel="noopener noreferrer">Aula 17</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h1>Continuando de onde paramos na última aula.</h1>
A gente viu que podemos criar parâmetros novos em objetos em tempo de execução.
<h2>As classes podem ser definidas em qualquer lugar</h2>
<pre><code>
def format_string(string, formatter=None):
    class <span style="color: #ff6600;">DefaultFormatter</span>:
        def format(self, string):
            return str(string).title()
    if not formatter:
        formatter = DefaultFormatter()
    return formatter.format(string)
</code></pre>
<h2>Herança básica</h2>
<pre><code>
class Contact:
    all_contacts = []
    def __init__(self, name, email):
        self.name = name
        self.email = email
        Contact.all_contacts.append(self)

class Supplier(Contact):
    def order(self, order):
        print("Nós enviamos o pedido {} para o {}".format(order, self.name))
</code></pre>
<h2>Polimorfismo</h2>
<pre><code>
class AudioFile:
    def __init__(self, filename):
        if not filename.endswith(self.ext):
            raise Exception("Formato inválido!")
        self.filename = filename

class MP3File(AudioFile):
    ext = "mp3"
    def play(self):
        print("Tocando {} como mp3".format(self.filename))
</code></pre>
<h2>Valeu pessoal, nos vemos na próxima aula.  🖖</h2>`,

    'aula-19-python-biblioteca-padrao-modulo-math': `<h1>Aula 19 - Python - Biblioteca Padrão - Módulo math</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-18-programacao-funcional-em-python/" target="_blank" rel="noopener noreferrer">Aula 18</a> <a href="https://www.codigofluente.com.br/aula-20-python-biblioteca-padrao-modulo-io/" target="_blank" rel="noopener noreferrer">Aula 20</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Seguindo ;)</h2>
<h2>Biblioteca Padrão do Python</h2>
A <strong>biblioteca padrão</strong> já vem <strong>embutida</strong> na distribuição do Python.
<h2>Módulo Math</h2>
O módulo <strong>math</strong> fornece acesso às funções matemáticas definidas em <strong>C</strong>.
<ul>
<li><strong>math.ceil(x)</strong> - retorna o teto de x. Ex: <code>math.ceil(9.24)</code> → 10</li>
<li><strong>math.floor(x)</strong> - retorna o piso de x. Ex: <code>math.floor(9.24)</code> → 9</li>
<li><strong>math.factorial(x)</strong> - retorna o fatorial. Ex: <code>math.factorial(6)</code> → 720</li>
<li><strong>math.sqrt(x)</strong> - raiz quadrada. Ex: <code>math.sqrt(81)</code> → 9.0</li>
<li><strong>math.pow(x, y)</strong> - x elevado a y. Ex: <code>math.pow(2,3)</code> → 8.0</li>
<li><strong>math.log(x)</strong> - logaritmo natural de x</li>
<li><strong>math.pi</strong> - constante π = 3.141592…</li>
<li><strong>math.e</strong> - constante e = 2.718281…</li>
</ul>
<h2>Ficamos por aqui, nos vemos na próxima aula.  🖖</h2>`,

    'aula-15-python-orientacao-a-objeto-01': `<h1>Aula 15 - Python - Orientação a Objeto</h1>
<h2>Programação orientada a objetos</h2>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-14-python-pacotes-packages/" target="_blank" rel="noopener noreferrer">Aula 14</a> <a href="https://www.codigofluente.com.br/aula-16-python-orientacao-a-objetos-02/" target="_blank" rel="noopener noreferrer">Aula 16</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Conceito</h2>
Programação orientada a objetos é um dos paradigmas de programação.
<h2>Tudo em python é objeto</h2>
Python é essencialmente orientado a objeto. Todos os tipos herdam da classe <strong>object</strong>.
<pre><code>
isinstance(1, object) # True
</code></pre>
<h2>Criando classes Python</h2>
<pre><code>
class MyFirstClass:
    pass

a = MyFirstClass()
b = MyFirstClass()
</code></pre>
<h2>Criando a classe ponto</h2>
<pre><code>
class Point:
    def move(self, x, y):
        self.x = x
        self.y = y
    def reset(self):
        self.move(0, 0)
    def calculate_distance(self, other_point):
        return math.sqrt((self.x - other_point.x)**2 + (self.y - other_point.y)**2)
</code></pre>
<h2>Construtor</h2>
<pre><code>
class Point:
    def __init__(self, x, y):
        self.move(x, y)  
    def move(self, x, y):
        self.x = x
        self.y = y

point = Point(3, 5)
print(point.x, point.y)
</code></pre>
<h2>Nos vemos na próxima aula e continuaremos a aprender sobre OO em python.</h2>`,

    'aula-20-python-biblioteca-padrao-modulo-io': `<h1>Aula 20 - Python - Biblioteca Padrão - Módulo I/O</h1>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h3><a href="https://www.codigofluente.com.br/aula-19-python-biblioteca-padrao-modulo-math/" target="_blank" rel="noopener noreferrer">Aula 19</a> <a href="#" target="_blank" rel="noopener noreferrer">Aula 21</a></h3>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Seguindo ;)</h2>
<h2>Biblioteca Padrão do Python</h2>
<h2><strong>Módulo I/O -</strong> Ferramentas para <strong>streams</strong></h2>
O módulo <strong>IO</strong> serve para lidar com vários tipos de <strong>E/S</strong>.

Existem três tipos principais de <strong>I/O</strong>: texto, binário e bruto (<strong>raw</strong>).
<h2><strong>Text I/O</strong></h2>
Um <strong>Text I/O</strong> espera e produz objetos <strong>str</strong>.
<pre><code>
f = open("text_input.txt")
f = open("text_input.txt", "r", encoding="utf-8")
</code></pre>
<h2><strong>Binary I/O</strong></h2>
<pre><code>
f = open("python_logo.png", "rb")
f2 = open("python_logo.png", "wb")
</code></pre>
<h2>Lendo arquivos</h2>
<pre><code>
with open('text_input.txt', 'r') as reader:
    print(reader.read())
</code></pre>
<h2>Gravando arquivos</h2>
<pre><code>
with open('text_input.txt', 'a') as a_writer:
    a_writer.write('Elixir\n')
</code></pre>
<h2>É isso, vimos bastante coisas sobre <strong>módulo I/O</strong>, ficamos por aqui. ;)</h2>`,

    'aula-13-python-modules-modulos': `<h1>Python - Modules - Módulos</h1>
<h3><a href="https://www.codigofluente.com.br/aula-12-python-pydoc-documentacao/" target="_blank" rel="noopener noreferrer">Aula 12</a> <a href="https://www.codigofluente.com.br/aula-14-python-pacotes-packages/" target="_blank" rel="noopener noreferrer">Aula 14</a></h3>
<h1>Que fazer esse curso com certificação?</h1>
<h2>Acesse:</h2>
<h2><a href="https://workover.com.br/python-codigo-fluente" target="_blank" rel="noopener">https://workover.com.br/python-codigo-fluente</a></h2>
<h2>Automatize tarefas do dia a dia com python:</h2>
[caption id="attachment_9169" align="alignnone" width="300"]<a href="https://bit.ly/automatizando-tarefas-python-bot" target="_blank" rel="noopener"><img class="size-medium wp-image-9169" src="https://www.codigofluente.com.br/wp-content/uploads/2019/10/python-300x300.png" alt="Curso Python Bot" width="300" height="300" /></a> Curso Python Bot[/caption]
<h2>Módulos são arquivos com código python que podem ser importados por outros arquivos python.</h2>
Podem ter qualquer estrutura do Python e são executados quando são importados ou executados diretamente.

Um módulo é então, um arquivo contendo definições e instruções Python.

O nome do arquivo é o nome do módulo com o sufixo .py
<pre><code>
def fat_recursiva(n):
    if n < 2:
        return 1
    else:
        return n * fat_recursiva(n - 1)
</code></pre>
Importando o módulo:
<code>import fatorial</code>
<code>fatorial.fat_recursiva(5) #Saída 120</code>

Variante com from:
<code>from fatorial import fat_recursiva</code>
<code>fat_recursiva(5) #Saída 120</code>
<h2>Executando módulos como scripts</h2>
<pre><code>
if __name__ == "__main__":
    import sys
    print(fat_recursiva(int(sys.argv[1])))
</code></pre>
<h2>É isso, na próxima a gente vai falar sobre packages (pacotes)</h2>`,

};

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    await dbConnect();

    console.log(`\n${DRY_RUN ? '🔍 DRY RUN — nada será salvo.' : '💾 MODO REAL — salvando no MongoDB.'}`);
    console.log(`📋 Posts a restaurar: ${Object.keys(POSTS).length}\n`);

    let restored = 0;

    for (const [slug, content] of Object.entries(POSTS)) {
        process.stdout.write(`Restaurando: ${slug} ... `);

        if (!DRY_RUN) {
            await Post.updateOne({ slug }, { $set: { content } });
        }

        console.log(`✅ (${content.length} chars)`);
        restored++;
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`  Posts restaurados: ${restored}`);

    if (DRY_RUN) {
        console.log('\n⚠️  Nada foi salvo. Para aplicar rode com --save:');
        console.log('   npx tsx --env-file=.env.local src/scripts/restore-damaged-posts.ts --save\n');
    } else {
        console.log('\n✅ Restauração concluída.\n');
    }
}

main().catch(console.error).finally(() => process.exit());