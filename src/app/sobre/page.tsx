import React from 'react';

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Sobre o <span className="text-neon-cyan">Código Fluente</span><span className="text-neon-pink">.</span>
        </h1>
        <div className="w-20 h-1 bg-neon-cyan mb-10"></div>
      </header>

      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-8 text-lg">
        <p>
          O <strong className="text-white">Código Fluente</strong> é um portal de educação em tecnologia totalmente gratuito, criado para quem quer aprender programação de verdade — do básico ao avançado.
        </p>

        <p>
          Aqui você encontra aulas em vídeo complementadas por conteúdo textual detalhado, cobrindo linguagens como <span className="text-neon-cyan">Python, JavaScript, Go, C e R</span>, além de frameworks como <span className="text-neon-cyan">Django</span>, e temas como <span className="text-neon-cyan">Git, complexidade de algoritmos, ciência de dados, Big Data e Machine Learning</span>.
        </p>

        <p>
          Nosso conteúdo inclui tutoriais práticos de <span className="text-white">Hadoop</span> e seu ecossistema, construção de modelos preditivos com <span className="text-white">R</span>, análise de sentimento com dados do <span className="text-white">Twitter</span>, redes neurais com <span className="text-neon-pink">TensorFlow e Keras</span> — conteúdo técnico e aprofundado que nasceu antes mesmo do boom das IAs generativas — e muito mais, sempre com foco em aplicações reais.
        </p>

        <p>
          Também acompanhamos a evolução da <span className="text-neon-cyan font-bold">Inteligência Artificial</span>, com conteúdos sobre sistemas multi-agentes, plataformas de IA e as tecnologias que estão moldando o futuro.
        </p>

        <div className="my-16 py-8 border-y border-white/10 bg-white/[0.02] px-8 rounded-lg">
          <p className="text-white text-xl font-medium italic text-center">
            "Acreditamos que o maior mérito que uma comunidade pode ter é investir em arte, cultura, educação e conhecimento. Na era da revolução digital, dominar tecnologia é uma das formas mais poderosas de transformar vidas."
          </p>
        </div>

        <p className="text-center font-bold text-xl text-neon-cyan tracking-tight">
          O Código Fluente nasceu dessa crença — e segue firme nela.
        </p>
      </div>
    </div>
  );
}
