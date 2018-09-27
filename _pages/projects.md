---
title: "Projects"
permalink: /projects/
layout: single
author_profile: true
header:
  image: /assets/images/UC_spring.jpg
---
## <a name="mgs-with-agreement"></a>Minimalist Grammars and agreement
Stabler's Minimalist Grammars provide a useful tool for modeling natural language syntax by defining grammar fragments in a very precise way. As a formalization of Chomsky's Minimalist Program, they can accommodate linguistic analyses from the field of generative syntax. However, they have no machinery for encoding agreement: while morphology can be simulated by multiplying lexical items, there is no systematic way to state generalizations and implement actual proposals. My goal is to extend Minimalist Grammars with morphological features and operations on them.  
A Javascript implementation of MGs with agreement can be found on [this page]({{ site.baseurl }}/demos/mg-constructor).

* **Morphological agreement in Minimalist Grammars**  
*[22nd Conference on Formal Grammar](http://fg.phil.hhu.de/2017/), July 22--23, 2017. Toulouse, France*  
[[slides]({{ site.baseurl }}/assets/pdfs/Ermolaeva_agreement_in_MGs_slides.pdf)] [[paper]({{ site.baseurl }}/assets/pdfs/Ermolaeva_agreement_in_MGs.pdf)] [[demo]({{ site.baseurl }}/demos/mg-constructor)]

## <a name="formalizing-dm"></a>Formalizing Distributed Morphology
Together with [Daniel Edmiston](https://danedmiston.github.io/home_page/), I am working on a mathematically rigorous formalization of the Distributed Morphology framework. We are interested in adapting DM to work over strings. Distributed Morphology is typically depicted as operating on (binary) trees, meaning its strong-generative capacity is above regular. By constraining it to operating on strings, we restrict the strong-generative capacity of the morphological module to that of regular languages, providing an immediate explanation for the *regular*ity of morphological phenomena in natural language.

* **Distributed Morphology as a regular relation**  
(with Daniel Edmiston)  
*[1st meeting of the Society for Computation in Linguistics](https://blogs.umass.edu/scil/scil-2018/), January 4--7, 2018. Salt Lake City, UT*  
[[extended abstract]({{ site.baseurl }}/assets/pdfs/Ermolaeva&Edmiston_DM_as_a_regular_relation_extended_abstract.pdf)] [[poster]({{ site.baseurl }}/assets/pdfs/Ermolaeva&Edmiston_DM_as_a_regular_relation_poster.pdf)]

* **Distributed Morphology over strings**  
(with Daniel Edmiston)  
*[41st Annual Penn Linguistics Conference](http://www.ling.upenn.edu/Events/PLC/plc41/), March 23--26, 2017. Philadelphia, PA*  
[[abstract]({{ site.baseurl }}/assets/pdfs/Ermolaeva&Edmiston_DM_over_strings_abstract.pdf)] [[poster]({{ site.baseurl }}/assets/pdfs/Ermolaeva&Edmiston_DM_over_strings_poster.pdf)]
<!-- * **DM on Strings**  
(with Daniel Edmiston)  
*[Morphology and Syntax Workshop](https://voices.uchicago.edu/morphologyandsyntax/), February 10, 2017. Chicago, IL*  
[[slides]({{ site.baseurl }}/assets/pdfs/Ermolaeva&Edmiston_DM_on_strings_slides.pdf)] -->

## <a name="automated-processing-of-agglutinative-morphology"></a>Automated processing of agglutinative morphology
The majority of existing tools that deal with complex morphology rely on either hand-written rules or large text corpora. I am interested in taking the third option: extract (agglutinative) morphology from a small sample of fully analyzed word forms. The main challenge is to reconstruct allomorphs and morphotactic sequences missing from the sample. Hand-glossed texts are a natural output of linguistic fieldwork, readily available even for under-studied languages. The goal of this project is to facilitate tasks such as morphological parsing for agglutinative languages, with a focus on good performance even with very limited language-specific resources.  

One application of this and related work is <span style="font-variant:small-caps;">Diretra</span>, a tool for computer-aided translation which I am developing in collaboration with [Alëna Aksënova](https://www.aaksenova.com/). <span style="font-variant:small-caps;">Diretra</span> is designed for and tested on Turkic languages; its primary goal is to provide a word-for-word translation of a given text, reflecting the morphological phenomena of the source language as precisely as possible.

* **<span style="font-variant:small-caps;">Diretra</span>, a customizable direct translation system: first sketches**  
(with Alëna Aksënova)  
*[2nd International TRANSLATA Conference](http://aux.uibk.ac.at/c61349/en), October 30--November 1, 2014. Innsbruck, Austria*  
[[slides]({{ site.baseurl }}/assets/pdfs/Aksenova&Ermolaeva_Diretra_slides.pdf)] [[paper]({{ site.baseurl }}/assets/pdfs/Aksenova&Ermolaeva_Diretra.pdf)]

* **Морфологический анализатор <span style="font-variant:small-caps;">Diretra</span>: больше, чем глосса
[<span style="font-variant:small-caps;">Diretra</span>, a morphological analyzer: more than a gloss]**  
(with Alëna Aksënova)  
*201th Meeting of the Workshop on Mathematical Methods Applied to Linguistics, October 25, 2014. Moscow, Russia*  
[[slides-RU]({{ site.baseurl }}/assets/pdfs/Aksenova&Ermolaeva_Diretra_slides-RU.pdf)]

* **An adaptable morphological parser for agglutinative languages**  
*[Italian Conference on Computational Linguistics](http://www.fileli.unipi.it/projects/clic/en), December 9--10, 2014. Pisa, Italy*  
[[poster]({{ site.baseurl }}/assets/pdfs/Ermolaeva_parser_poster.pdf)] [[paper]({{ site.baseurl }}/assets/pdfs/Ermolaeva_parser.pdf)]

## Turkic converbs
In Turkic languages, converbs --- a type of non-finite verb form --- are a regular means of constructing complex predications. The *-p* converb, present in the majority of Turkic languages, exhibits a number of interesting syntactic properties. In particular, *-p* converbs can correspond to both adjunct and coordinate syntactic structures.  
<!--  -->
<!-- This direction of research is largely based on fieldwork data from a number of OTiPL linguistic expeditions. -->

* **О двойственной природе тюркских конвербов [On the dual nature of Turkic
converbs]**  
(with [Pavel Graschenkov](https://www.pavelgra.com/))  
*[Moscow State University Bulletin, Series 9: Philology](http://vestnik.philol.msu.ru) (2), pp. 42–57, 2015. Moscow, Russia*  
[[paper-RU]({{ site.baseurl }}/assets/pdfs/Graschenkov&Ermolaeva_On_the_dual_nature_of_Turkic_converbs.pdf)]

* **Подлежащее в разносубъектных конструкциях с деепричастием на *-p*
в киргизском языке и мишарском диалекте татарского языка [Subjects in
constructions with the *-p* converb in Kyrgyz and Mishar Tatar]**  
*[10th Conference on Grammar and Typology for Young Researchers](http://www.youngconfspb.com/e/proshedshie-konferencii/x-konferenciya-2013-g), November 21--23, 2013. St. Petersburg, Russia*  
[slides-RU] [[paper-RU]({{ site.baseurl }}/assets/pdfs/Ermolaeva_Subjects_in_DS_constructions_in_Mishar_Tatar_and_Kyrgyz.pdf)]
