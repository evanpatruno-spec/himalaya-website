// ============================================================================
// CONTENU OFFICIEL INTÉGRAL "À PROPOS" — EXTRAIT DE HIMALAYACORP.COM (FR & EN)
// Pages sources :
// - https://www.himalayacorp.com/fr/a-propos.html (/en/about.html)
// - https://www.himalayacorp.com/fr/co-fondateurs.html (/en/co-founders.html)
// - https://www.himalayacorp.com/fr/services.html (/en/services.html)
// - https://www.himalayacorp.com/fr/faq.html (/en/faq.html)
// - https://www.himalayacorp.com/fr/liens-immobiliers.html
// - https://www.himalayacorp.com/fr/devenir-courtier-immobilier.html (/en/become-a-broker.html)
// - https://www.himalayacorp.com/fr/devenir-affilie.html
// ============================================================================

export const ABOUT_CONTENT = {
  FR: {
    pageTitle: 'À propos',
    pageSubtitle: 'Depuis 2008, Immobilier Himalaya Real Estate Corp. accompagne ses clients au Québec, au Canada et à l’international.',
    tabs: [
      { id: 'qui-nous-sommes', label: 'Qui nous sommes' },
      { id: 'co-fondateurs', label: 'Co-fondateurs' },
      { id: 'services', label: 'Services & Associations' },
      { id: 'franchises', label: 'Franchises' },
      { id: 'carrieres', label: 'Carrières & Affiliés' },
      { id: 'faq', label: 'Foire aux questions' },
      { id: 'liens', label: 'Liens immobiliers' }
    ],

    whoWeAre: {
      heading: 'Qui nous sommes',
      intro:
        'Depuis sa fondation en 2008, l’agence immobilière Himalaya a su se hisser au rang de leader en immobilier au Québec, au Canada et partout dans le monde. Nos clients, issus de milieux variés, nous choisissent, entre autres, pour notre réseau de contacts international, notre connaissance approfondie des transactions immobilières, notre intégrité et pour notre sens aigu du service à la clientèle. Chaque membre de notre équipe mettra tout en œuvre afin de servir adéquatement nos clients, en proposant un vaste choix de propriétés de qualité, à vendre ou à louer, destinées tant au secteur commercial, résidentiel qu’industriel.',
      profileTitle: 'NOTRE PROFIL',
      profileParagraphs: [
        'Immobilier Himalaya Real Estate Corp. est une agence immobilière internationale, active dans le domaine du courtage immobilier commercial, industriel et de l’investissement résidentiel. Son siège social est situé au Québec (Canada).',
        'Nous rassemblons une équipe multiculturelle de courtiers immobiliers professionnels et intègres, qui travaille sans relâche à satisfaire les besoins de nos clients d’une manière optimale. Nos courtiers choisissent Himalaya parce qu’ils désirent gravir de nouveaux sommets d’excellence et se joindre à une équipe performante et dévouée qui cherche continuellement à se dépasser.',
        'Nous ne choisissons pas seulement nos courtiers pour leur compétence et leur expérience mais également pour leur sens éthique, leur intégrité et leur désir de sans cesse trouver de meilleurs moyens d’effectuer leur travail auprès de nos clients.',
        'Pour nous, il est essentiel de créer et maintenir des liens durables avec les différents acteurs de notre industrie. Nous entretenons d’ailleurs de très bonnes relations de travail avec les utilisateurs et les gestionnaires d’espaces, les promoteurs immobiliers, les agences immobilières ainsi que les firmes de gestion immobilière et les institutions financières.'
      ],
      missionTitle: 'NOTRE MISSION',
      missionText:
        'Favoriser la conclusion de transactions justes et honnêtes, cultiver les relations professionnelles à long terme, être la ressource immobilière locale pour tous les besoins de notre clientèle et offrir un réseau international.',
      valuesTitle: 'NOS VALEURS',
      valuesList: ['Collaboration', 'Communication', 'Écoute', 'Respect', 'Éthique'],
      valuesText:
        'La collaboration, la communication, l’écoute, le respect et l’éthique sont de grandes valeurs au sein d’Himalaya Immobilier, et ce, pour toutes nos transactions immobilières.',
      contactCta: 'Contactez-nous : cela nous fera plaisir de discuter avec vous de votre projet immobilier !'
    },

    coFounders: {
      heading: 'Une agence immobilière menée par des professionnels de cœur',
      intro:
        'Immobilier Himalaya a été fondée par deux collaborateurs de longue date partageant, depuis leur rencontre en 1998, les mêmes valeurs de respect, d’intégrité, de communication et d’excellence. Pour Geniev Mondoux et Roger Rhéaume, un processus immobilier n’est pas uniquement une transaction : c’est une occasion de créer des liens, de rassembler les gens et offrir à leurs clients la chance de réaliser les projets qui leur tiennent à cœur.',
      founders: [
        {
          id: 'geniev-mondoux',
          name: 'Geniev Mondoux',
          role: 'Vice-Président — Courtier immobilier agréé',
          credentials: 'CPA, MBA • Co-fondateur & Directeur d’agence',
          portrait: '/DATA/COURTIERINFOSUP/11_courtierGrand.JPG',
          photos: [
            '/DATA/CMSIMAGE/721.jpg',
            '/DATA/CMSIMAGE/722.jpg'
          ],
          paragraphs: [
            'Homme de famille plaçant l’intégrité et le respect avant toute chose, Geniev Mondoux est comptable professionnel agréé (CPA), détenteur d’une maîtrise en administration (MBA), entrepreneur et créateur d’opportunités. C’est son amour du contact humain et des relations durables qui l’entraîne vers une carrière en immobilier, à compter de 2008. Passionné par son métier et motivé chaque jour par les rencontres qu’il multiplie, Geniev met tout en œuvre afin d’offrir un service irréprochable à ses clients. Sa plus grande force est d’innover, de trouver des solutions concrètes afin de mener à terme toute transaction immobilière. Également, sa grande capacité d’écoute, sa facilité d’approche et sa convivialité, combinées à sa compétence et à sa grande expérience font de lui un partenaire recherché dans le cadre de nombreux projets immobiliers.',
            'Cofondateur d’Himalaya avec son complice de longue date, Roger Rhéaume, directeur d’agence immobilière au sein du groupe, Geniev relève avec brio les défis mis sur son chemin et parvient toujours à trouver des solutions concrètes et à atteindre des résultats optimaux.',
            'Animé par des valeurs familiales solides et soucieux de faire régner le respect et l’intégrité dans toutes les sphères de sa vie, Geniev est un bon vivant chaleureux et convivial, qui ne rate jamais l’occasion de faire rire et de divertir clients et collègues.'
          ]
        },
        {
          id: 'roger-rheaume',
          name: 'Roger Rhéaume',
          role: 'Président — Courtier immobilier agréé, DA',
          credentials: 'Co-fondateur • Ancien membre du CA de l’OACIQ',
          portrait: '/DATA/COURTIERINFOSUP/99_courtierGrand.jpg',
          photos: [
            '/DATA/CMSIMAGE/200.jpg',
            '/DATA/CMSIMAGE/201.jpg',
            '/DATA/CMSIMAGE/202.jpg'
          ],
          sections: [
            {
              subtitle: 'Une très belle vie — « On est présent sur terre une fois seulement, et je veux en profiter au maximum ! »',
              paragraphs: [
                'J’ai commencé à faire de la randonnée en montagne et à visiter plusieurs pays dès mes 18 ans. La montagne représente pour moi l’aventure, le silence, une source d’énergie et de respect. J’ai grimpé jusqu’à 5 785 mètres d’altitude pour voir l’Everest, qui est sur la plus belle chaîne de montagnes au monde : l’Himalaya. Quel beau cadeau me suis-je fait pour mes 50 ans !',
                'Qu’on parle de montagnes en Europe, en Asie, en Afrique ou en Amérique, je les ai parcourues. J’ai appris à connaître les gens qui y vivent. Pour moi, le monde est infini et beau. Depuis plus de 50 ans, je voyage pour admirer notre belle planète, pour voir ses peuples, leurs vies, leurs us et coutumes. La plus belle richesse que je possède est l’amour et l’amitié.'
              ]
            },
            {
              subtitle: 'La passion de l’immobilier',
              paragraphs: [
                'Mon expérience antérieure dans le domaine du commerce et des services m’a amené à me développer dans le secteur du courtage commercial. J’ai acquis plus de 20 ans d’expérience avant de créer, avec mon partenaire, une entreprise de courtage : Immobilier Himalaya Real Estate Corp. L’immobilier est pour moi une passion que j’ai acquise. J’ai été membre du Conseil d’Administration de l’OACIQ durant 3 années. J’ai aussi été sur le CA du Collège Immobilier du Québec plus de 5 années, ainsi que Président du comité commercial de la CIGM plus de 6 années. En 2022, j’ai ouvert un bureau de courtage immobilier au Mexique avec un partenaire, Fabien Herman, afin d’aider les investisseurs québécois et français à acquérir des biens immobiliers. J’ai aussi créé des relations d’affaires avec des courtiers en République Dominicaine pour ces mêmes raisons.',
                'Ma passion m’a amené à offrir des formations et des conférences aux courtiers pour que tous et chacun soient plus informés. Étant un grand voyageur, j’ai combiné le travail avec les voyages. Je suis présent dans plusieurs pays comme courtier immobilier, pour des inscriptions et pour des projets de développement immobilier.'
              ]
            }
          ]
        }
      ]
    },

    services: {
      heading: 'Des services immobiliers qui se démarquent par leur excellence',
      intro1:
        'Immobilier Himalaya est le partenaire de choix pour toute transaction immobilière. Notre présence dans plusieurs pays ainsi que notre expertise et notre savoir-faire nous permettent de guider nos clients avec professionnalisme dans leur projet immobilier, et d’agir en tant que conseiller pour eux, qu’ils soient issus du secteur commercial, résidentiel ou industriel.',
      intro2:
        'Notre équipe vous offre une gamme complète de services en courtage immobilier. Notre vaste connaissance du marché et notre expérience sont à votre avantage : vous obtiendrez des résultats optimaux, à la hauteur de vos attentes. Faites appel aux courtiers immobiliers d’Himalaya pour les services suivants :',
      brokerageTitle: 'Vente, location et recherche de biens immobiliers commerciaux et industriels',
      brokerageItems: [
        'Bureaux et locaux',
        'Édifices',
        'Multilogements',
        'Entreprises',
        'Pourvoiries et campings',
        'Hôtelleries',
        'Terrains',
        'Franchises et licences',
        'Vente et recherche d’investissements résidentiels',
        'Développement de projets commerciaux et industriels'
      ],
      consultingTitle: 'Consultation immobilière',
      consultingItems: [
        'Analyse et identification des besoins',
        'Analyse de marché-secteur',
        'Évaluation des opportunités et menaces',
        'Analyse et recommandation des alternatives',
        'Analyse et recommandation de services professionnels complémentaires',
        'Renouvellement de baux commerciaux et industriels',
        'Projet de mise en marché de condominiums',
        'Jumelage et mise en contact avec notre réseau international'
      ],
      internationalTitle: 'Courtage immobilier international',
      internationalText:
        'Afin de servir au mieux notre clientèle, nous avons développé des relations d’affaires à l’international, et connaissons très bien le marché immobilier de nombreux pays. Notre solide réseau de contacts fiables nous permet de vous guider vers les meilleures opportunités immobilières. Pour de plus amples renseignements, veuillez communiquer avec nous. C’est avec plaisir que nous vous rencontrerons pour discuter de votre projet et de vos aspirations !',
      associationsTitle: 'Associations dont nous sommes membres',
      associationsText:
        'Immobilier Himalaya est notamment membre de l’Association professionnelle des courtiers immobiliers du Québec (APCIQ), du Conseil québécois de la franchise (CQF), d’ICSC (International Council of Shopping Centers), de la Fédération des pourvoiries du Québec (FPQ) ainsi que de Camping Québec. Ces affiliations nous permettent d’offrir un service optimal à nos clients cherchant des opportunités de vente, d’achat ou de location dans le secteur commercial, notamment dans le domaine des pourvoiries et campings, du commerce de détail ou de la restauration.',
      associationsBadges: [
        { code: 'OACIQ', name: 'Organisme d’autoréglementation du courtage immobilier du Québec' },
        { code: 'APCIQ', name: 'Association professionnelle des courtiers immobiliers du Québec' },
        { code: 'FPQ', name: 'Fédération des pourvoiries du Québec' },
        { code: 'Camping Québec', name: 'Association des terrains de camping du Québec' },
        { code: 'CQF', name: 'Conseil québécois de la franchise' },
        { code: 'ICSC', name: 'International Council of Shopping Centers (Innovating Commerce Serving Communities)' }
      ]
    },

    careers: {
      brokerHeading: 'Devenir courtier immobilier chez Himalaya',
      brokerParagraphs: [
        'Depuis sa fondation en 2008, Immobilier Himalaya Real Estate Corp. est devenue synonyme d’une grande connaissance de l’immobilier commercial, industriel et résidentiel. Elle est réputée pour son honnêteté, son intégrité et offre un service à la clientèle exceptionnel. Toutes ces qualités favorisent la collaboration, le respect et la réalisation de transactions.',
        'En vous joignant à notre agence en devenant courtier immobilier, vous bénéficierez des privilèges et du réseautage que nous avons acquis et construits au fil des ans. Vous profiterez également de nos outils et ferez partie intégrante d’une équipe qui collabore et qui s’entraide. Grâce à Immobilier Himalaya Real Estate Corp., vous vous démarquerez à l’échelle internationale.',
        'Que vous soyez un courtier immobilier d’expérience ou que vous désiriez vous perfectionner dans ce secteur de l’industrie immobilière, Immobilier Himalaya Real Estate Corp. sera heureuse de vous accueillir dans son équipe.'
      ],
      brokerBenefitsTitle: 'Avantages offerts aux courtiers Himalaya',
      brokerBenefits: [
        'Formation, rencontres et séminaires mensuels',
        'Frais allégés (structure de coût avantageuse)',
        'Équipe intègre et professionnelle',
        'Réseau et possibilité de développement international',
        'Site internet multiculturel',
        'Partenaires multidisciplinaires (avocats, notaires, évaluateurs, environnement)',
        'Image prestigieuse et adresse au centre-ville de Montréal (2000, av. McGill College)',
        'Accès en ligne à un bureau virtuel (courriel, documents, réseautage, etc.)'
      ],
      affiliateHeading: 'Devenez affilié d’une agence immobilière de premier plan',
      affiliateParagraphs: [
        'Immobilier Himalaya Real Estate Corp. bénéficie d’une enviable réputation d’excellence en immobilier au Canada et à l’échelle internationale. Notre service hors pair, notre sens éthique et notre professionnalisme font de nous un partenaire de choix pour vos affaires.',
        'En devenant affilié de notre agence immobilière, vous bénéficierez des avantages de nos réseaux national et international ainsi que des privilèges que nous avons acquis au fil des années, grâce à un travail rigoureux, intègre et acharné. La collaboration et l’entraide sont les valeurs au cœur de notre philosophie d’entreprise et toutes nos agences affiliées bénéficient d’un soutien optimal.',
        'Immobilier Himalaya désire s’associer à des agences immobilières professionnelles provenant de différents pays et de différentes cultures afin de poursuivre son développement à l’échelle internationale.'
      ],
      affiliateBenefitsTitle: 'Avantages pour les agences affiliées',
      affiliateBenefits: [
        'Réseau international établi',
        'Visibilité internationale multilingue',
        'Structure de coût allégée',
        'Équipe intègre et professionnelle',
        'Image prestigieuse et adresse au centre-ville de Montréal',
        'Accès en ligne à un bureau virtuel (courriel, documents, réseautage, etc.)'
      ],
      contactNote: 'Veuillez communiquer avec Geniev Mondoux ou Roger Rhéaume pour obtenir de plus amples renseignements.',
      applyBtn: 'Contacter la direction (Geniev Mondoux & Roger Rhéaume)'
    },

    faq: {
      heading: 'Foire aux questions — Expertise par domaine immobilier',
      subtitle: 'Réponses détaillées sur les locations et bureaux commerciaux, les franchises, les pourvoiries, les campings et le multi-logement au Québec.',
      categories: [
        { id: 'all', label: 'Toutes les questions' },
        { id: 'locations', label: 'Locations commerciales' },
        { id: 'bureaux', label: 'Bureaux commerciaux' },
        { id: 'franchises', label: 'Franchises' },
        { id: 'pourvoiries', label: 'Pourvoiries' },
        { id: 'campings', label: 'Campings' },
        { id: 'multilogement', label: 'Multi-logement' }
      ],
      items: [
        {
          category: 'locations',
          q: 'Qu’est-ce qu’un loyer de base ?',
          a: 'Le loyer de base est la portion que l’on paie en fonction du nombre de pieds carrés utilisés et/ou l’espace locatif incluant les espaces communs. Ce qui correspond à la valeur immobilière du local.'
        },
        {
          category: 'locations',
          q: 'Qu’est-ce qu’un loyer additionnel ?',
          a: 'Le loyer additionnel représente les frais d’exploitation du local et du bâtiment (électricité, taxes, entretien, assurances, etc.), toujours en fonction du nombre de pieds carrés utilisés et/ou l’espace locatif incluant les espaces communs.'
        },
        {
          category: 'locations',
          q: 'Est-ce qu’un loyer se négocie ?',
          a: 'Tout se négocie : le loyer de base ainsi que le loyer additionnel, de même que l’installation et les améliorations locatives.'
        },
        {
          category: 'locations',
          q: 'Doit-on négocier un bail à court terme ou à long terme ?',
          a: 'Pour une entreprise en démarrage, la durée du bail doit être la plus courte possible. Cela permet de minimiser vos engagements si votre projet échoue, à plus forte raison si vous cautionnez personnellement le bail. Un bail de cinq ans et plus est avantageux, car on peut obtenir un meilleur prix et de meilleures conditions.'
        },
        {
          category: 'locations',
          q: 'Avons-nous d’autres méthodes pour évaluer la durée d’un bail ?',
          a: 'Selon l’investissement monétaire que le nouveau locataire aura à investir en améliorations locatives et le nombre d’années sur lequel ses améliorations seront amorties, on peut évaluer le nombre d’années minimum pour sa rentabilité.'
        },
        {
          category: 'locations',
          q: 'Qu’est-ce que signifie « installation » ?',
          a: 'L’installation est une période que l’on accorde pour que le locataire installe tout son équipement afin de faire fonctionner son commerce. En général, le bailleur accorde gratuitement une période de temps (nombre de semaines ou de mois) selon le type de commerce. L’installation peut inclure le loyer de base et le loyer additionnel. Le locataire doit se munir d’une assurance dès l’installation pour se protéger en cas de sinistre ou d’accident.'
        },
        {
          category: 'locations',
          q: 'Est-ce que le maintien des lieux est systématique ?',
          a: 'Contrairement au loyer résidentiel, le renouvellement d’un bail commercial se négocie dès le départ. Une ou des options sont importantes pour le locataire aussi bien pour sa survie que pour la vente future de son entreprise.'
        },
        {
          category: 'locations',
          q: 'Pourquoi une option ?',
          a: 'Une ou des options sont importantes, car l’aménagement d’un local est coûteux et son emplacement est stratégique. Nous devons aussi tenir compte de la vente potentielle de l’entreprise en fonction de son marché et de ses concurrents.'
        },
        {
          category: 'locations',
          q: 'Est-ce que l’option de renouvellement est une obligation ?',
          a: 'Non, une option de renouvellement est une option que l’on a déjà négociée préalablement. Ce n’est pas une obligation. Le bail que nous avons négocié indique le nombre de mois avant la fin du terme pour exercer notre option ou la refuser et se retirer.'
        },
        {
          category: 'locations',
          q: 'Est-ce que mon courtier immobilier peut négocier mon bail ?',
          a: 'Les services d’un bon courtier immobilier sont très utiles pour votre entreprise. Il faut s’assurer qu’il possède l’expérience et les connaissances en matière de baux commerciaux. Un bail commercial est un contrat qui engage un bailleur et un locataire pour une longue période de temps !'
        },
        {
          category: 'locations',
          q: 'Combien de courtiers sont professionnels de l’immobilier commercial et industriel ?',
          a: 'Parmi les quelque 17 000 courtiers au Québec, moins de 6 % approximativement sont professionnels du commercial et de l’industriel. Le domaine diffère du résidentiel : il n’est pas question de répondre à des besoins personnels, mais à des exigences professionnelles complexes.'
        },
        {
          category: 'locations',
          q: 'Est-ce que les contrats commerciaux et industriels sont les mêmes que les contrats résidentiels ?',
          a: 'Pour finaliser la vente d’un immeuble industriel ou conclure la location d’espace, il n’est pas question de remplir des documents standard comme au résidentiel. Chaque cas est différent. Les documents comportent une quantité de clauses particulières et spécifiques au droit commercial, en fonction du type de vente ou de location.'
        },
        {
          category: 'locations',
          q: 'Quelle est la différence entre un bail brut, semi-brut et triple net (NNN) ?',
          a: 'Dans un bail brut, le loyer mensuel inclut la majorité des dépenses d’exploitation (taxes, assurances, entretien). Dans un bail semi-brut, le locataire paie généralement son électricité, son ménage ou une partie des hausses de taxes. Dans un bail triple net (NNN), le locataire paie le loyer de base ainsi que sa quote-part complète des taxes foncières, des assurances du bâtiment et des frais d’entretien des aires communes (CAM), parfois même de gestion.'
        },
        {
          category: 'locations',
          q: 'Puis-je céder mon bail ou sous-louer mon local commercial si je vends mon entreprise ?',
          a: 'La majorité des baux commerciaux permettent la cession de bail ou la sous-location avec le consentement préalable du bailleur, lequel ne peut généralement pas refuser sans motif sérieux. Il est crucial de négocier dès le départ les conditions de cession, l’absence de pénalités abusives et l’éventuelle libération de la caution personnelle lors de la vente du fonds de commerce.'
        },
        {
          category: 'locations',
          q: 'À quoi sert une clause d’exclusivité commerciale (non-concurrence) dans un bail ?',
          a: 'Dans un centre commercial ou un immeuble multi-locataires, une clause d’exclusivité interdit au bailleur de louer un autre local du complexe à un concurrent offrant la même activité principale (par exemple, un second restaurant italien, café ou clinique dentaire). Cette protection préserve votre achalandage et sécurise la valeur de revente de votre entreprise.'
        },
        {
          category: 'locations',
          q: 'Les loyers commerciaux sont-ils assujettis aux taxes de vente (TPS et TVQ) et à un dépôt ?',
          a: 'Oui. Contrairement aux baux résidentiels, la location d’espaces commerciaux, de bureaux et industriels est taxable (TPS et TVQ applicables sur le loyer de base et le loyer additionnel). Le bailleur exige fréquemment un dépôt de garantie équivalant à un ou plusieurs mois de loyer brut ainsi qu’un cautionnement corporatif ou personnel selon la solidité financière du locataire.'
        },
        {
          category: 'bureaux',
          q: 'Quelle est la différence entre superficie utilisable et superficie locative (facteur de perte) ?',
          a: 'La superficie utilisable désigne l’espace privatif réellement occupé par vos bureaux et salles de réunion. La superficie locative (ou louable) ajoute à cet espace une quote-part proportionnelle des aires communes de l’étage et du bâtiment (halls, corridors, ascenseurs, salles de bain), appelée facteur de perte ou facteur d’espaces communs. Comme le loyer est calculé sur la superficie locative, il est essentiel de vérifier ce ratio avant de comparer deux édifices.'
        },
        {
          category: 'bureaux',
          q: 'Comment fonctionnent les allocations aux améliorations locatives (TI) et les bureaux clé en main ?',
          a: 'Le bailleur peut accorder une allocation en dollars par pied carré (TI allowance) afin de financer les cloisons, le vitrage, l’électricité, le câblage et la finition, ou réaliser lui-même les travaux selon un cahier des charges convenu (formule clé en main). Le montant obtenu dépend directement de la durée du bail, de la qualité de crédit du locataire et du loyer net négocié.'
        },
        {
          category: 'bureaux',
          q: 'Comment négocier les places de stationnement dans un édifice à bureaux ?',
          a: 'En périphérie, les baux incluent souvent un ratio fixe de places extérieures par 1 000 pi² loués, alors qu’au centre-ville les places intérieures sont facturées mensuellement en sus selon un ratio négocié. Il convient de faire inscrire au bail le nombre exact de vignettes garanties, l’accès visiteurs, la tarification des bornes de recharge électrique et les modalités d’indexation.'
        },
        {
          category: 'bureaux',
          q: 'Que faut-il vérifier pour le CVAC (climatisation/chauffage), l’électricité et l’accès 24/7 ?',
          a: 'Les édifices à bureaux exploitent habituellement leurs systèmes centraux de chauffage et de climatisation durant les heures ouvrables standards (par exemple du lundi au vendredi de 7 h à 18 h). Si vos équipes travaillent le soir ou la fin de semaine, le bail doit préciser le tarif horaire du CVAC hors heures, l’accès par carte magnétique 24/7 et si l’électricité des prises et de l’éclairage est incluse ou comptabilisée séparément.'
        },
        {
          category: 'bureaux',
          q: 'Comment distinguer les immeubles à bureaux de classe A, B et C ?',
          a: 'Les immeubles de classe A offrent les emplacements les plus prestigieux, des systèmes mécaniques et ascenseurs récents, des certifications environnementales (LEED, BOMA BEST), une sécurité 24/7 et des loyers additionnels souvent plus élevés. Les classes B représentent des immeubles professionnels bien entretenus offrant un excellent rapport qualité-prix, tandis que les classes C conviennent aux entreprises recherchant des locaux fonctionnels à budget réduit.'
        },
        {
          category: 'bureaux',
          q: 'Qu’est-ce qu’un droit d’expansion ou droit de premier refus (ROFR) pour des bureaux ?',
          a: 'Pour une entreprise en croissance, le droit de premier refus (ROFR) oblige le bailleur à vous offrir prioritairement un espace adjacent s’il devient vacant avant de le louer à un tiers. Combiné à des clauses souples de sous-location partielle (très utiles avec le télétravail hybride), cet outil permet d’ajuster la taille de vos bureaux sans devoir déménager.'
        },
        {
          category: 'franchises',
          q: 'Pourquoi recourir à un courtier spécialisé (membre CQF) pour implanter une franchise ?',
          a: 'En tant que membre officiel du Conseil québécois de la franchise (CQF), notre équipe maîtrise l’équilibre tripartite entre franchiseur, franchisé et bailleur. Nous repérons les sites hors marché ou sur artères commerciales stratégiques, analysons le potentiel de vente au pied carré et coordonnons la négociation du bail en harmonie avec le contrat de franchise.'
        },
        {
          category: 'franchises',
          q: 'Pourquoi le franchiseur demande-t-il souvent d’approuver le bail et un droit d’intervention (step-in right) ?',
          a: 'L’emplacement étant un actif stratégique de la bannière, le franchiseur exige fréquemment que le bail lui soit conditionnel, avec un droit d’intervention (step-in right) lui permettant de reprendre le bail ou d’y substituer un autre franchisé en cas de défaut. Anticiper ces clauses dès la lettre d’intention évite des blocages juridiques de dernière minute.'
        },
        {
          category: 'franchises',
          q: 'Quels critères immobiliers et techniques varient entre une franchise de restauration et une franchise de détail ?',
          a: 'Une franchise de restauration requiert une capacité électrique et de gaz suffisante, une sortie d’évacuation pour hotte commerciale jusqu’au toit, une trappe à graisse, un accès de livraison et parfois une terrasse. Un commerce de détail ou de services privilégiera davantage le linéaire de vitrine, l’accès piétonnier, le ratio de stationnement et la visibilité d’enseigne sur pylône ou façade.'
        },
        {
          category: 'franchises',
          q: 'Comment protéger l’ouverture d’une franchise face aux délais de permis municipaux et d’alcool (RACJ) ?',
          a: 'Le bail doit prévoir des conditions suspensives liées à l’obtention des approbations de zonage, de permis de transformation, d’affichage extérieur, de terrasse et, s’il y a lieu, de permis de la Régie des alcools, des courses et des jeux (RACJ). Il faut également arrimer le début du loyer payant à la fin réaliste des travaux et non uniquement à la signature.'
        },
        {
          category: 'franchises',
          q: 'Vaut-il mieux reprendre une franchise existante ou ouvrir une nouvelle succursale ?',
          a: 'L’achat d’une franchise existante offre un historique de revenus vérifiable, des équipements déjà installés et une clientèle établie, mais impose de vérifier l’état du matériel, les clauses restantes du bail, les redevances à jour et les travaux exigés lors du transfert. L’ouverture d’une nouvelle unité permet un concept neuf sur mesure, mais demande un capital de démarrage plus élevé avant d’atteindre le seuil de rentabilité.'
        },
        {
          category: 'franchises',
          q: 'Comment fonctionne la zone d’exclusivité territoriale d’une bannière par rapport au bail ?',
          a: 'Le contrat de franchise accorde généralement un territoire protégé (rayon kilométrique ou secteur postal) dans lequel le franchiseur n’ouvrira pas de concurrent sous la même enseigne. Il faut s’assurer avant de signer le bail que l’adresse choisie respecte pleinement les territoires existants des autres franchisés et que la durée du bail correspond à celle du contrat de franchise.'
        },
        {
          category: 'pourvoiries',
          q: 'Comment se transfère un bail de droits exclusifs de chasse et pêche lors de la vente d’une pourvoirie ?',
          a: 'Au Québec, l’exploitation d’une pourvoirie à droits exclusifs repose sur un bail délivré par le gouvernement (MRNF / MELCCFP). Ce bail et les terres publiques sous bail ne se transfèrent pas automatiquement comme un simple terrain privé : la promesse d’achat doit être conditionnelle à l’approbation officielle du transfert du bail et des permis par le ministère concerné, ainsi qu’aux vérifications administratives d’usage.'
        },
        {
          category: 'pourvoiries',
          q: 'Quelle est la différence entre une pourvoirie avec droits exclusifs et sans droits exclusifs ?',
          a: 'Une pourvoirie avec droits exclusifs détient un territoire délimité sur terres du domaine de l’État où elle possède l’exclusivité de l’exploitation commerciale de la chasse, de la pêche et du piégeage. Une pourvoirie sans droits exclusifs est souvent implantée sur des terrains privés ou en périphérie de plans d’eau publics sans territoire exclusif réservé ; la valeur des actifs, les redevances et la structure d’acquisition diffèrent donc sensiblement.'
        },
        {
          category: 'pourvoiries',
          q: 'Comment les chalets, bateaux, moteurs et équipements sont-ils inventoriés et ventilés dans l’acte de vente ?',
          a: 'Une transaction de pourvoirie combine généralement des immeubles (terrains privés, auberge, chalets, bâtiments de service), des droits (bail exclusif, permis, achalandage, site web) et un important inventaire mobilier (embarcations, moteurs hors-bord, VTT, motoneiges, génératrices, literie). La ventilation précise entre ces catégories dans l’offre d’achat est déterminante pour le financement, les droits de mutation et l’application des taxes TPS/TVQ.'
        },
        {
          category: 'pourvoiries',
          q: 'Quelles vérifications techniques et environnementales faut-il mener avant d’acheter une pourvoirie ?',
          a: 'L’inspection diligente d’une pourvoirie doit vérifier la conformité des installations septiques (règlement Q-2, r. 22), les systèmes de traitement et d’analyse d’eau potable, l’état des réservoirs de carburant (essence/diesel/propane) et les risques de contamination de sol, l’autonomie énergétique (solaire, génératrices ou réseau), ainsi que la conformité des quais, barrages ou ponceaux.'
        },
        {
          category: 'pourvoiries',
          q: 'Comment se finance l’acquisition d’une pourvoirie au Québec ?',
          a: 'Peu d’institutions financent ces actifs récréotouristiques sans expertise spécialisée. Les prêteurs commerciaux, la BDC ou certains organismes régionaux exigent généralement une mise de fonds substantielle (souvent 25 % à 40 % ou plus selon la part de droits et d’équipements), des états financiers vérifiés sur 3 ans, un plan d’affaires solide et une évaluation agréée réalisée par un évaluateur connaissant le domaine des pourvoiries.'
        },
        {
          category: 'pourvoiries',
          q: 'Quels impacts ont l’accès (route forestière vs hydravion) et l’entretien des chemins sur la rentabilité ?',
          a: 'Une pourvoirie accessible en véhicule automobile rejoint un bassin familial et de villégiature plus large, mais dépend de l’entretien et du partage des coûts des chemins multiressources ou ponts forestiers. À l’inverse, une pourvoirie accessible uniquement par hydravion offre un positionnement haut de gamme exclusif, mais impose une logistique d’approvisionnement aérienne et une tarification adaptée à la clientèle.'
        },
        {
          category: 'pourvoiries',
          q: 'Quels permis touristiques (CITQ) et obligations fauniques doivent être à jour ?',
          a: 'L’exploitant doit maintenir à jour son attestation d’enregistrement touristique (CITQ / Loi sur l’hébergement touristique), son permis de pourvoirie, les licences d’alcool ou de restauration s’il y a une auberge, ainsi que la tenue des registres de prélèvements fauniques. En tant que membre de la FPDQ, Immobilier Himalaya accompagne vendeurs et acheteurs sur chacun de ces volets.'
        },
        {
          category: 'campings',
          q: 'Pourquoi la répartition entre campeurs saisonniers et voyageurs influence-t-elle autant la valeur d’un camping ?',
          a: 'Les emplacements saisonniers génèrent des revenus prévisibles et encaissés tôt en saison, réduisant la vulnérabilité aux week-ends pluvieux. Les emplacements voyageurs et les prêts-à-camper offrent un revenu moyen par nuitée supérieur mais exigent plus de gestion, de marketing et d’accueil. L’équilibre optimal entre ces deux clientèles sécurise le flux de trésorerie et rassure les prêteurs.'
        },
        {
          category: 'campings',
          q: 'Comment détermine-t-on le juste prix d’un terrain de camping (BAIIA vs valeur foncière) ?',
          a: 'Un terrain de camping s’évalue principalement en fonction de sa rentabilité opérationnelle normalisée (BAIIA / revenu net d’exploitation avant service de la dette et salaires discrétionnaires) et du multiple de marché applicable à sa catégorie, tout en tenant compte de la valeur sous-jacente du terrain (superficie, frontage sur plan d’eau, potentiel résidentiel ou d’expansion) et des immobilisations récentes.'
        },
        {
          category: 'campings',
          q: 'Quelles vérifications réglementaires et d’infrastructures sont incontournables pour un camping ?',
          a: 'Il faut valider la capacité réelle et la conformité des réseaux d’aqueduc, de puits et d’installations septiques en fonction du nombre de sites 2 et 3 services, la capacité électrique (ampérage 15/30/50 A pour les VR modernes), les zones inondables ou bandes riveraines, le zonage municipal et agricole (CPTAQ le cas échéant) ainsi que l’enregistrement actif auprès de la CITQ.'
        },
        {
          category: 'campings',
          q: 'Quelle est la meilleure période pour inspecter et acheter un camping ?',
          a: 'Bien que les transactions se concluent souvent entre l’automne et le début du printemps afin que le nouvel exploitant prépare la saison suivante, il est fortement recommandé d’inspecter les infrastructures (pompes, eau, électricité, voirie, bâtiments) pendant qu’elles sont en opération (entre mai et octobre), lorsque la nappe phréatique et le système sont observables.'
        },
        {
          category: 'campings',
          q: 'Comment financer l’achat d’un camping et quelles garanties les banques demandent-elles ?',
          a: 'Les institutions financières et la BDC analysent la stabilité des trois derniers exercices financiers, l’expérience de gestion touristique de l’acheteur, le rapport d’évaluation agréée et l’état des infrastructures souterraines. Selon que le camping comporte une résidence principale sur place et selon la taille de la transaction, la mise de fonds requise se situe habituellement entre 25 % et 35 %.'
        },
        {
          category: 'campings',
          q: 'Peut-on ajouter de nouveaux sites de VR ou des prêts-à-camper sur un camping existant ?',
          a: 'L’ajout d’emplacements ou d’unités d’hébergement (chalets, yourtes, mini-chalets) n’est jamais automatique : il nécessite de vérifier les droits acquis vs le zonage municipal actuel, l’autorisation environnementale (capacité de traitement des eaux usées) et, sur terre agricole ou forestière, les permissions applicables avant de valoriser un potentiel d’agrandissement dans le prix.'
        },
        {
          category: 'multilogement',
          q: 'Quelle est la différence de financement et d’évaluation entre un 2 à 4 logements et un 5 logements et plus ?',
          a: 'Un immeuble de 2 à 4 logements (duplex, triplex, quadruplex) est généralement considéré comme résidentiel aux fins de financement et évalué surtout par la méthode des comparables vendus et les revenus personnels de l’emprunteur. Dès 5 logements et plus, l’immeuble bascule en financement commercial : sa valeur est dictée avant tout par ses revenus nets d’exploitation (méthode du revenu) et sa capacité à couvrir la dette (ratio RCD).'
        },
        {
          category: 'multilogement',
          q: 'Comment fonctionnent le Taux Global d’Actualisation (TGA / Cap Rate) et le Multiplicateur des Revenus Bruts (MRB) ?',
          a: 'Le MRB divise le prix demandé par les revenus bruts annuels pour offrir une première comparaison rapide entre immeubles similaires, sans toutefois refléter les dépenses. Le TGA divise le Revenu Net d’Exploitation (RNE) par la valeur de l’immeuble (ou à l’inverse Valeur = RNE / TGA) : c’est l’indicateur clé des investisseurs institutionnels et des évaluateurs dès 5 logements et plus.'
        },
        {
          category: 'multilogement',
          q: 'Quels avantages offre le financement assuré par la SCHL (incluant APH Select) ?',
          a: 'Pour les immeubles de 5 logements et plus, l’assurance prêt SCHL permet d’obtenir des taux d’intérêt plus bas, des ratios prêt-valeur plus élevés (moins de mise de fonds) et des amortissements prolongés. Le programme APH Select récompense particulièrement les projets intégrant des critères d’abordabilité, d’efficacité énergétique et d’accessibilité, permettant parfois des amortissements jusqu’à 40 ou 50 ans selon le pointage obtenu.'
        },
        {
          category: 'multilogement',
          q: 'Comment le Tribunal administratif du logement (TAL) influence-t-il les hausses de loyer et la valeur d’un plex ?',
          a: 'Au Québec, les renouvellements et augmentations de loyer sont encadrés par les critères du TAL, basés notamment sur l’évolution des taxes, des assurances, des frais d’énergie et des travaux majeurs amortis. Les immeubles achevés depuis 5 ans ou moins bénéficient d’une exemption temporaire de fixation (art. 1955 C.c.Q.) si l’avis requis figure au bail, un élément crucial à valider lors de l’analyse d’acquisition.'
        },
        {
          category: 'multilogement',
          q: 'Quels documents et éléments techniques vérifier lors de la vérification diligente d’un immeuble à revenus ?',
          a: 'La vérification diligente comprend l’examen complet de tous les baux et annexes, des relevés de loyers perçus, des comptes de taxes municipales et scolaires, des factures d’énergie (Hydro-Québec, gaz), des contrats d’entretien (déneigement, ascenseur), des preuves de travaux majeurs, du certificat de localisation à jour ainsi que d’une inspection rigoureuse du bâtiment (toiture, maçonnerie, plomberie, électricité, fondations et tests environnementaux au besoin).'
        },
        {
          category: 'multilogement',
          q: 'Pourquoi la valeur économique calculée par la banque diffère-t-elle parfois des dépenses déclarées par le vendeur ?',
          a: 'Même si un propriétaire effectue lui-même le déneigement, la conciergerie ou l’entretien courant sans se verser de salaire, l’évaluateur et le prêteur appliquent des dépenses normalisées (frais de gestion, conciergerie, réserve pour réparations majeures, taux d’inoccupation normatif). Calculer le RNE avec ces paramètres normalisés évite de surestimer la valeur économique réelle et le financement maximal disponible.'
        },
        {
          category: 'multilogement',
          q: 'Quels frais de clôture et taxes prévoir lors de l’achat d’un immeuble multilogement ?',
          a: 'Il faut prévoir les droits de mutation immobilière (taxe de bienvenue), les honoraires du notaire, l’évaluation agréée et les rapports techniques (environnement Phase I, inspection de bâtiment, certificat de localisation) souvent exigés dès 5 logements et plus. Les loyers résidentiels sont exonérés de TPS/TVQ, sauf composante commerciale (immeuble mixte) ou immeuble neuf dont le traitement fiscal doit être validé avec votre notaire et fiscaliste.'
        }
      ]
    },

    links: {
      heading: 'Liens immobiliers & Réseau de partenaires',
      subtitle: 'Ressources gouvernementales officielles et répertoire de professionnels partenaires au Canada et à l’international.',
      govTitle: 'Sites informatifs du gouvernement (Québec & Canada)',
      govLinks: [
        {
          name: 'Registraire des entreprises du Québec',
          desc: 'Identité des personnes morales, administrateurs et immatriculation',
          url: 'https://www.quebec.ca/entreprises-et-travailleurs-autonomes/obtenir-renseignements-entreprise/recherche-registre-entreprises/acceder-registre-entreprises'
        },
        {
          name: 'Registre foncier du Québec',
          desc: 'Consultation officielle des transactions et titres immobiliers',
          url: 'https://www.registrefoncier.gouv.qc.ca'
        },
        {
          name: 'Corporations Canada',
          desc: 'Sociétés de régime fédéral et répertoire corporatif canadien',
          url: 'https://ised-isde.canada.ca/site/corporations-canada/fr'
        },
        {
          name: 'Répertoire des municipalités du Québec (MAMH)',
          desc: 'Évaluation et taxes municipales, règlements municipaux de zonage',
          url: 'https://www.quebec.ca/gouvernement/portrait-quebec/repertoire-municipalites'
        },
        {
          name: 'Commission de protection du territoire agricole du Québec (CPTAQ)',
          desc: 'Zonage agricole, autorisations et cartographie du territoire',
          url: 'https://www.cptaq.gouv.qc.ca'
        },
        {
          name: 'Cartographie des zones inondables (Géo-Inondations Québec)',
          desc: 'Atlas et cartes officielles des zones d’inondation au Québec',
          url: 'https://zonesinondables.mrnf.gouv.qc.ca/'
        },
        {
          name: 'Fédération des centres de services scolaires / Taxes scolaires',
          desc: 'Répertoire des centres de services et commissions scolaires du Québec',
          url: 'https://www.fcssq.quebec'
        },
        {
          name: 'Répertoire du patrimoine culturel du Québec',
          desc: 'Immeubles patrimoniaux, sites classés et aires de protection',
          url: 'https://www.patrimoine-culturel.gouv.qc.ca'
        }
      ],
      partnersTitle: 'Partenaires multidisciplinaires (Canada & International)',
      partnerGroups: [
        {
          category: 'Avocats & Droit commercial / Franchise',
          items: [
            {
              name: 'FASKEN Avocats — Me Frédéric P. Gilbert, B.A., LL.B.',
              specialty: 'Agents de brevets et de marques de commerce, Franchise',
              address: 'Tour de la Bourse, 800 rue du Square-Victoria, bureau 3700, Montréal, QC H2Z 1E9',
              contact: '514-397-5232 • fgilbert@fasken.com',
              website: 'https://www.fasken.com/fr'
            },
            {
              name: 'Tutino Joseph Grégoire Avocats — Me Isabelle Grégoire',
              specialty: 'Vices cachés, franchises et bail commercial',
              address: '1080, Côte du Beaver Hall, bureau 600, Montréal, QC H2Z 1S8',
              contact: '514-878-3878 • igregoire@tutinolex.com',
              website: 'https://tutinolex.com'
            },
            {
              name: 'GAO Avocat inc. — Me Yuan Znan Gao, LL.B., J.D., TEP',
              specialty: 'Droit des affaires et immobilier',
              address: '6955, boul. Taschereau, suite 106, Brossard, QC J4Z 1A7',
              contact: '514-518-0880 • gao.avocat@gmail.com'
            }
          ]
        },
        {
          category: 'Arpenteurs-géomètres',
          items: [
            {
              name: 'Stéphan Roy, Arpenteur-géomètre (Groupe SR)',
              specialty: 'Certificats de localisation, piquetage et arpentage foncier',
              address: '255, boul. Curé-Labelle, bureau 100, Laval, QC H7L 2Z9',
              contact: '514-990-2333 • info@groupesr.ca',
              website: 'https://www.groupesr.ca'
            }
          ]
        },
        {
          category: 'Évaluateurs agréés (Pourvoiries & Commercial)',
          items: [
            {
              name: 'André Leblanc et Ass. — Marc-André Leblanc, CMA, É.A.',
              specialty: 'Évaluateur agréé — Pourvoiries et propriétés commerciales',
              address: '2965, rue de Boischatel, Trois-Rivières, QC G8Z 3Z8',
              contact: '819-373-6579 • maleblanc@aleblanc-ea.com',
              website: 'https://www.aleblanc-ea.com'
            },
            {
              name: 'Jean Philippe Baril, B.A.A., É.A., AACI, P.App. (Baril Évaluation)',
              specialty: 'Évaluateur agréé — Pourvoiries et propriétés commerciales',
              address: '141, rue Bonaventure, Trois-Rivières, QC G9A 2A9',
              contact: '819-373-1401 / 1-866-373-1401 • info@barilevaluation.com',
              website: 'https://barilevaluation.com'
            }
          ]
        },
        {
          category: 'Services environnementaux (Analyse de sol & Phase I/II/III)',
          items: [
            {
              name: 'Physis Environnement Inc. — François Munger, Chimiste',
              specialty: 'Analyse environnementale de sol et équipement',
              address: 'Montréal, Québec',
              contact: '514-516-2255 • fmunger@physisenvironnement.com',
              website: 'https://www.physis.ca'
            },
            {
              name: 'MultiTEST — Krystel Segura, M.Sc., Vice-présidente',
              specialty: 'Services environnementaux et caractérisation de sites',
              address: '464, boul. Roland-Therrien, Longueuil, QC J4H 3V9',
              contact: '514-990-2063 • info@multitest.ca',
              website: 'https://www.multitest.ca'
            }
          ]
        },
        {
          category: 'Consultants, Franchise, Géomarketing & Design',
          items: [
            {
              name: 'Imagine Franchise Consultant — Stéphane Breault, Président',
              specialty: 'Développement et conseil en franchise',
              address: '1751, rue Richardson, bureau 4.509, Montréal, QC H3K 1G6',
              contact: '514-935-5686 poste 229 • sbreault@imagine-fl.com',
              website: 'https://www.imaginefranchise.com'
            },
            {
              name: 'Indicia Géomarketing — Daniel Lemire, Président',
              specialty: 'Études de marché et géomarketing commercial',
              address: '3467, boul. des Entreprises, suite 103, Terrebonne, QC J6X 4J9',
              contact: '450-477-3330 • daniel.lemire@indicia.ca',
              website: 'https://indicia.ca'
            },
            {
              name: 'DSD Groupe Design — Dimitri Smolens, APDIQ, DIC',
              specialty: 'Services d’aménagement commercial et design intérieur',
              address: '2197, rue Sherbrooke Est, suite 010, Montréal, QC H2K 1C8',
              contact: '514-985-5320 • dsmolens@groupedesign.com',
              website: 'https://groupedesign.com'
            }
          ]
        },
        {
          category: 'Partenaires internationaux (République Dominicaine)',
          items: [
            {
              name: 'République Dominicaine — Wilfredo Mena & Asocs. / Revart',
              specialty: 'Architecture, construction et supervision de projets immobiliers',
              address: 'République Dominicaine',
              contact: '809-788-0121 / 829-601-6745'
            }
          ]
        }
      ]
    }
  },

  EN: {
    pageTitle: 'About Us',
    pageSubtitle: 'Since 2008, Himalaya Real Estate Corp. has been guiding clients across Quebec, Canada, and internationally.',
    tabs: [
      { id: 'qui-nous-sommes', label: 'Who We Are' },
      { id: 'co-fondateurs', label: 'Co-Founders' },
      { id: 'services', label: 'Services & Associations' },
      { id: 'franchises', label: 'Franchises' },
      { id: 'carrieres', label: 'Careers & Affiliates' },
      { id: 'faq', label: 'FAQ' },
      { id: 'liens', label: 'Real Estate Links' }
    ],

    whoWeAre: {
      heading: 'Who We Are',
      intro:
        'Since our foundation in 2008, Himalaya Real Estate has grown to become a leader in real estate in Quebec, in Canada, and throughout the world. Our clients, from many diverse backgrounds, choose Himalaya due to our numerous international contacts, our vast knowledge in real estate transactions, our integrity, and our renowned customer service. The members of our team are dedicated to best serving our clients and offering a vast selection of quality properties to either rent or buy in the commercial, residential, and industrial real estate sectors.',
      profileTitle: 'OUR PROFILE',
      profileParagraphs: [
        'Himalaya Real Estate Corp. is an international real estate agency active in the commercial and industrial real estate sectors, as well as the residential investment market. Its headquarters are located in Quebec, Canada.',
        'Our team is made up of a diverse group of brokers with multicultural backgrounds who value honesty and professionalism, working relentlessly to satisfy our clients’ every request. Our brokers choose to work with Himalaya Corp. due to their desire to reach a higher level of excellence and be part of a committed, high-performing team that continually seeks to excel.',
        'With the same mindset, we choose our brokers not only for their competence and experience, but also for their work ethic, honesty, and relentless efforts to find better solutions for the clients they represent.',
        'For us, it is essential to create and maintain lasting relationships with the key players in our industry. We have established strong working relationships with space users and managers, real estate developers, brokerage agencies, property management firms, and financial institutions.'
      ],
      missionTitle: 'OUR MISSION',
      missionText:
        'Conclude fair and honest transactions, cultivate long-term professional relationships, be the local real estate resource for all of our clients’ needs, and offer an international network.',
      valuesTitle: 'OUR VALUES',
      valuesList: ['Collaboration', 'Communication', 'Listening', 'Respect', 'Ethics'],
      valuesText:
        'Collaboration, communication, active listening, respect, and ethics are core values at Himalaya Real Estate across all of our real estate transactions.',
      contactCta: 'Contact us: we will be delighted to discuss your real estate project with you!'
    },

    coFounders: {
      heading: 'A Real Estate Agency Led By Passionate Professionals',
      intro:
        'Himalaya Real Estate was founded by two long-time collaborators who have shared the same values of respect, integrity, communication, and excellence since they first met in 1998. For Geniev Mondoux and Roger Rhéaume, real estate is not just a transaction: it is an opportunity to create bonds, bring people together, and offer their clients the chance to carry out the projects that matter most to them.',
      founders: [
        {
          id: 'geniev-mondoux',
          name: 'Geniev Mondoux',
          role: 'Vice-President — Chartered Real Estate Broker',
          credentials: 'CPA, MBA • Co-Founder & Agency Executive Officer',
          portrait: '/DATA/COURTIERINFOSUP/11_courtierGrand.JPG',
          photos: [
            '/DATA/CMSIMAGE/721.jpg',
            '/DATA/CMSIMAGE/722.jpg'
          ],
          paragraphs: [
            'A family man who places integrity and respect above all else, Geniev Mondoux is a Chartered Professional Accountant (CPA), holds a Master of Business Administration (MBA), and is an entrepreneur and creator of opportunities. It is his love of human contact and lasting relationships that drove him toward a career in real estate beginning in 2008. Passionate about his profession and motivated every day, Geniev is dedicated to accomplishing the missions entrusted to him by his clients. His greatest strength is his ability to innovate and find concrete solutions in order to complete any real estate transaction. His ability to listen, approachability, and warmth—combined with his skills and extensive experience—make him a sought-after partner in many real estate projects.',
            'Co-founder of Himalaya with his long-time colleague Roger Rhéaume and Executive Officer of the agency, Geniev successfully takes on complex challenges and always manages to find concrete solutions while achieving optimal results.',
            'Driven by strong family values and committed to maintaining respect and integrity in all spheres of his life, Geniev is warm and friendly, never missing an opportunity to make clients and colleagues feel welcome.'
          ]
        },
        {
          id: 'roger-rheaume',
          name: 'Roger Rhéaume',
          role: 'President — Chartered Real Estate Broker, DA',
          credentials: 'Co-Founder • Former Member of the OACIQ Board of Directors',
          portrait: '/DATA/COURTIERINFOSUP/99_courtierGrand.jpg',
          photos: [
            '/DATA/CMSIMAGE/200.jpg',
            '/DATA/CMSIMAGE/201.jpg',
            '/DATA/CMSIMAGE/202.jpg'
          ],
          sections: [
            {
              subtitle: 'An Adventurous Life — "We only live once, we must make the most of it!"',
              paragraphs: [
                'At the young age of 18, I started hiking in the mountains and visiting numerous countries. The mountains represent adventure, silence, and a source of energy and respect. I climbed to 5,785 meters of elevation in order to see Mount Everest, located on the most beautiful mountain range in the world: The Himalayas. What an amazing experience I was able to have for my 50th birthday!',
                'Whether speaking of mountains in Europe, Asia, Africa, or the Americas, I have hiked them all and met the people who live there. For me, the world is infinite and beautiful. For over 50 years, I have traveled to admire our planet, its people, their lives, and their cultures. The greatest riches I possess are love and friendship.'
              ]
            },
            {
              subtitle: 'The Passion of Real Estate',
              paragraphs: [
                'My previous experience in trade and services led me to the commercial brokerage sector. I acquired more than 20 years of experience in marketing and business before creating, with my partner, our brokerage firm: Himalaya Real Estate Corp. Real estate is a lifelong passion. I previously served for 3 years on the Board of Directors of the OACIQ, served for over 5 years on the Board of the Collège Immobilier du Québec, and served as Chairman of the Commercial Committee of the GMREB (CIGM) for more than 6 years. In 2022, I also opened a real estate brokerage office in Mexico with partner Fabien Herman to help Quebec and French investors acquire properties, in addition to establishing business relationships with brokers in the Dominican Republic.',
                'My passion led me to offer training courses and lectures to brokers so that everyone is better informed. Being an avid traveler, I combined my work with international travel, remaining active across several countries for listings and real estate development projects.'
              ]
            }
          ]
        }
      ]
    },

    services: {
      heading: 'Real Estate Services Known for Their Excellence',
      intro1:
        'Himalaya Real Estate is the partner of choice for any real estate transaction. Our presence in multiple countries as well as our expertise and know-how allow our brokers to guide our clients professionally in their real estate projects and act as trusted advisors across the commercial, residential, and industrial sectors.',
      intro2:
        'Our team offers a full range of real estate brokerage services. Our vast knowledge of the market and our experience work to your advantage to deliver optimal results that meet your expectations. Call on Himalaya real estate brokers for the following services:',
      brokerageTitle: 'Sale, lease, and search of commercial and industrial properties',
      brokerageItems: [
        'Offices and commercial spaces',
        'Commercial & income buildings',
        'Multi-family properties',
        'Businesses',
        'Hunting & fishing outfitters and campsites',
        'Hotels and hospitality',
        'Development land',
        'Franchises and licenses',
        'Sale and search of residential investments',
        'Development of commercial and industrial projects'
      ],
      consultingTitle: 'Real Estate Consulting',
      consultingItems: [
        'Needs analysis and identification',
        'Market and sector analysis',
        'Evaluation of opportunities and threats',
        'Analysis and recommendation of alternatives',
        'Analysis and recommendation of complementary professional services',
        'Renewal of commercial and industrial leases',
        'Condominium marketing projects',
        'Matching and introductions through our international network'
      ],
      internationalTitle: 'International Real Estate Brokerage',
      internationalText:
        'In order to best serve our clients, we have developed strong international business relationships and know the real estate markets of many countries. Our reliable network of contacts allows us to guide you toward the best real estate opportunities. Please contact our office—our team will be pleased to meet with you to discuss your project and aspirations!',
      associationsTitle: 'Associations We Are Members Of',
      associationsText:
        'Himalaya Real Estate is a member of the Quebec Professional Association of Real Estate Brokers (QPAREB / APCIQ), the Quebec Franchise Council (Conseil québécois de la franchise — CQF), ICSC, the Quebec Outfitters Federation (Fédération des pourvoiries du Québec — FPQ), and Camping Québec. These affiliations allow us to offer optimal service to clients seeking sales, acquisitions, or leasing opportunities in the commercial sector, particularly in outfitters, campgrounds, retail, and hospitality/restaurants.',
      associationsBadges: [
        { code: 'OACIQ', name: 'Organisme d’autoréglementation du courtage immobilier du Québec' },
        { code: 'APCIQ', name: 'Quebec Professional Association of Real Estate Brokers (QPAREB)' },
        { code: 'FPQ', name: 'Quebec Outfitters Federation (Fédération des pourvoiries du Québec)' },
        { code: 'Camping Québec', name: 'Association des terrains de camping du Québec' },
        { code: 'CQF', name: 'Quebec Franchise Council (Conseil québécois de la franchise)' },
        { code: 'ICSC', name: 'International Council of Shopping Centers (Innovating Commerce Serving Communities)' }
      ]
    },

    careers: {
      brokerHeading: 'Become a Real Estate Broker at Himalaya',
      brokerParagraphs: [
        'Since our real estate agency was founded in 2008, Himalaya Real Estate Corp. has become synonymous with in-depth knowledge of commercial, industrial, and residential real estate, as well as a strong commitment to honesty, integrity, and exceptional customer service. These qualities promote collaboration, respect, and successful transactions.',
        'By joining our agency as a real estate broker, you benefit from the network and client base we have built over the years, as well as our tools and a collaborative team environment. Thanks to Himalaya Real Estate Corp., you will stand out both domestically and internationally.',
        'Whether you are an experienced real estate broker or wish to advance your career in this sector of the real estate industry, Himalaya Real Estate Corp. will be delighted to welcome you to our team.'
      ],
      brokerBenefitsTitle: 'Summary of Benefits Offered by Himalaya',
      brokerBenefits: [
        'Monthly trainings, meetings, and seminars',
        'Low cost structure',
        'Ethical and professional team',
        'Opportunity to develop international markets',
        'Multilingual website presence',
        'Multidisciplinary partners (lawyers, notaries, appraisers, environmental experts)',
        'Prestigious image and address in Downtown Montreal (2000 McGill College Ave.)',
        'Online access to a virtual office (e-mail, documents, networking, etc.)'
      ],
      affiliateHeading: 'Become an Affiliate of a Leading Real Estate Agency',
      affiliateParagraphs: [
        'Himalaya Real Estate Corp. enjoys an enviable reputation for excellence in real estate in Canada and internationally. Our outstanding service, strong ethics, and professionalism make us a partner of choice for your business.',
        'By becoming an affiliate of our real estate agency, you benefit from our national and international networks as well as the privileges we have built over the years through rigorous, honest, and dedicated work. Collaboration and mutual support are at the heart of our corporate philosophy, and all of our affiliated agencies receive optimal support.',
        'Himalaya Real Estate seeks to partner with professional real estate agencies from different countries and cultures to continue its international development.'
      ],
      affiliateBenefitsTitle: 'Benefits for Affiliated Agencies',
      affiliateBenefits: [
        'Established international network',
        'Multilingual international website visibility',
        'Streamlined cost structure',
        'Ethical and professional team',
        'Prestigious image and Downtown Montreal headquarters',
        'Online access to a virtual office (e-mail, documents, networking, etc.)'
      ],
      contactNote: 'Please contact Geniev Mondoux or Roger Rhéaume for more information.',
      applyBtn: 'Contact Management (Geniev Mondoux & Roger Rhéaume)'
    },

    faq: {
      heading: 'Frequently Asked Questions — By Real Estate Sector',
      subtitle: 'Comprehensive answers covering commercial & office leasing, franchises, outfitters, campgrounds, and multi-family properties in Quebec.',
      categories: [
        { id: 'all', label: 'All Questions' },
        { id: 'locations', label: 'Commercial Leasing' },
        { id: 'bureaux', label: 'Commercial Offices' },
        { id: 'franchises', label: 'Franchises' },
        { id: 'pourvoiries', label: 'Outfitters' },
        { id: 'campings', label: 'Campgrounds' },
        { id: 'multilogement', label: 'Multi-Family' }
      ],
      items: [
        {
          category: 'locations',
          q: 'What is "Base Rent"?',
          a: 'Base rent refers to the portion of rent paid based on the number of square feet used and/or the rental space including common areas, corresponding to the real estate value of the premises.'
        },
        {
          category: 'locations',
          q: 'What is meant by "Additional Rent"?',
          a: 'Additional rent represents the operating and administration costs of the rented space and building (electricity, property taxes, maintenance, insurance, etc.), calculated according to the square footage used and common areas.'
        },
        {
          category: 'locations',
          q: 'Can you negotiate your rent?',
          a: 'Everything is negotiable: the base rent, the additional rent, as well as the installation period and leasehold improvements.'
        },
        {
          category: 'locations',
          q: 'Is it better to negotiate a short-term or long-term lease?',
          a: 'For a start-up business, the length of the lease should be as short as possible to minimize obligations if the project does not go as planned, especially if you personally guarantee the lease. A lease of five years or more is advantageous for established businesses because better pricing and conditions can be negotiated.'
        },
        {
          category: 'locations',
          q: 'Do we have other methods to evaluate the duration of a lease?',
          a: 'Based on the monetary investment the new tenant will make in leasehold improvements and the number of years over which those improvements will be amortized, we can evaluate the minimum number of years required for profitability.'
        },
        {
          category: 'locations',
          q: 'What does "installation" signify?',
          a: 'The installation period is granted so the tenant can install all equipment needed to operate the business. Generally, the landlord grants a rent-free period (several weeks or months) depending on the business type. The tenant must obtain insurance as soon as installation begins.'
        },
        {
          category: 'locations',
          q: 'Is the right to remain in the premises automatic?',
          a: 'Unlike residential leases, commercial lease renewal is negotiated from the very beginning. Renewal options are vital for the tenant both for business continuity and for the future sale of the business.'
        },
        {
          category: 'locations',
          q: 'Why include a renewal option?',
          a: 'Options are important because fitting out commercial premises is costly and location is strategic. You must also account for the potential future sale of the business within its market.'
        },
        {
          category: 'locations',
          q: 'Is the option of renewal an obligation?',
          a: 'No, a renewal option is a pre-negotiated right, not an obligation. The lease specifies the number of months prior to the end of the term within which the tenant may exercise or decline the option.'
        },
        {
          category: 'locations',
          q: 'Can my real estate broker negotiate my lease?',
          a: 'The services of a skilled commercial real estate broker are highly valuable for your business. Make sure your broker has experience and expertise in commercial leases, as a commercial lease commits both landlord and tenant for a long period of time.'
        },
        {
          category: 'locations',
          q: 'How many brokers are commercial and industrial real estate professionals?',
          a: 'Among the roughly 17,000 real estate brokers in Quebec, fewer than 6% practice in commercial and industrial real estate. This field differs significantly from residential brokerage, addressing complex business requirements.'
        },
        {
          category: 'locations',
          q: 'Are commercial and industrial contracts the same as residential contracts?',
          a: 'To finalize the sale of an industrial building or lease commercial space, standard residential forms do not suffice. Every case is unique and requires specific commercial law clauses tailored to the transaction.'
        },
        {
          category: 'locations',
          q: 'What is the difference between a gross, semi-gross, and triple net (NNN) lease?',
          a: 'In a gross lease, the monthly rent includes most building operating expenses (property taxes, insurance, maintenance). In a semi-gross lease, the tenant typically pays electricity, janitorial services, or increases in taxes above a base year. In a triple net (NNN) lease, the tenant pays base rent plus its full proportionate share of property taxes, building insurance, and common area maintenance (CAM), often alongside management fees.'
        },
        {
          category: 'locations',
          q: 'Can I assign my lease or sublet my commercial space if I sell my business?',
          a: 'Most commercial leases permit lease assignment or subletting with the landlord’s prior consent, which generally cannot be unreasonably withheld. It is essential to negotiate clear assignment terms, avoid excessive review fees, and clarify whether the seller’s personal guarantee is released upon a qualified business transfer.'
        },
        {
          category: 'locations',
          q: 'Why include an exclusivity (non-compete) clause in a commercial retail lease?',
          a: 'In a shopping centre or multi-tenant commercial building, an exclusivity clause prevents the landlord from leasing another unit to a direct competitor operating the same primary concept (e.g., a second Italian restaurant, coffee shop, or dental clinic). This safeguards your customer traffic and protects your future business resale value.'
        },
        {
          category: 'locations',
          q: 'Are commercial rents subject to GST/QST and security deposits?',
          a: 'Yes. Unlike residential rentals, commercial, office, and industrial leases are subject to GST and QST on both base rent and additional rent. Landlords commonly require a security deposit equal to one or more months of gross rent as well as a corporate or personal guarantee depending on tenant creditworthiness.'
        },
        {
          category: 'bureaux',
          q: 'What is the difference between usable area and rentable area (load / gross-up factor)?',
          a: 'Usable area measures the private space exclusively occupied by your offices, reception, and meeting rooms. Rentable area adds a proportionate share of the floor and building common areas (lobbies, corridors, washrooms, mechanical rooms), known as the load or gross-up factor. Because rent is billed on rentable square footage, comparing effective usable space across buildings is essential.'
        },
        {
          category: 'bureaux',
          q: 'How do Tenant Improvement (TI) allowances and turnkey office build-outs work?',
          a: 'Landlords may offer a Tenant Improvement (TI) allowance expressed in dollars per square foot to help fund partitions, glazing, electrical, data cabling, and finishes, or deliver the space turnkey based on agreed architectural plans. The allowance size reflects lease duration, tenant covenant strength, and the negotiated net rent.'
        },
        {
          category: 'bureaux',
          q: 'How is parking negotiated in suburban versus downtown office buildings?',
          a: 'Suburban office parks typically provide a guaranteed ratio of surface stalls per 1,000 sq. ft. leased, whereas downtown towers allocate indoor spaces at additional monthly rates. Make sure guaranteed stall counts, visitor parking validation, EV charging policies, and annual rate caps are clearly stipulated in the lease.'
        },
        {
          category: 'bureaux',
          q: 'What should I verify regarding HVAC hours, electricity, and 24/7 building access?',
          a: 'Central HVAC systems normally operate during standard business hours (e.g., Monday to Friday, 7:00 a.m. to 6:00 p.m.). If your team works evenings or weekends, check the hourly after-hours HVAC charge, 24/7 keycard security procedures, and whether in-suite power and lighting are included in additional rent or separately metered.'
        },
        {
          category: 'bureaux',
          q: 'How do Class A, Class B, and Class C office buildings differ?',
          a: 'Class A buildings offer prime locations, modern elevators and mechanical systems, environmental certifications (LEED, BOMA BEST), 24/7 security, and generally higher additional rent. Class B properties provide well-maintained professional offices with strong cost-efficiency, while Class C buildings suit budget-focused tenants seeking functional workspace.'
        },
        {
          category: 'bureaux',
          q: 'What are Expansion Options and Rights of First Refusal (ROFR) in office leasing?',
          a: 'For growing companies, a Right of First Refusal (ROFR) requires the landlord to offer adjacent space to you before leasing it to another party when it becomes available. Paired with flexible partial-sublease rights suited to hybrid work schedules, these clauses allow you to scale workspace without relocating.'
        },
        {
          category: 'franchises',
          q: 'Why work with a CQF-member commercial broker when launching or relocating a franchise?',
          a: 'As an official member of the Conseil québécois de la franchise (CQF), our team navigates the three-way alignment between franchisor, franchisee, and landlord. We source off-market or prime arterial locations, evaluate sales-per-square-foot potential, and structure lease clauses consistent with the franchise agreement.'
        },
        {
          category: 'franchises',
          q: 'Why does a franchisor require lease review and step-in rights?',
          a: 'Because strategic retail locations are vital to brand equity, franchisors often require conditional lease approval along with step-in rights allowing the franchisor to assume the lease or assign it to a replacement franchisee in the event of default. Addressing these clauses at the letter-of-intent stage prevents closing delays.'
        },
        {
          category: 'franchises',
          q: 'How do site and technical requirements differ between restaurant and retail franchises?',
          a: 'Food-service franchises require sufficient electrical amps and gas supply, roof-vented commercial kitchen exhaust, grease traps, delivery access, and patio zoning. Retail or service banners prioritize storefront frontage, pedestrian traffic, parking convenience, and pylon or fascia signage visibility.'
        },
        {
          category: 'franchises',
          q: 'How should municipal permit and liquor licence (RACJ) delays be addressed in the lease?',
          a: 'Your lease should include conditions precedent for zoning confirmation, construction permits, exterior signage, patio authorization, and RACJ liquor permits where applicable. Rent commencement should be tied to a realistic build-out and fixturing window rather than lease execution alone.'
        },
        {
          category: 'franchises',
          q: 'Is it better to acquire an existing franchise location or open a brand-new unit?',
          a: 'Buying an existing franchise gives you verifiable historical sales, installed equipment, and an established customer base, while requiring careful inspection of equipment condition, remaining lease term, royalty status, and franchisor transfer upgrades. Opening a new location delivers a fresh build-out tailored to current brand standards, with higher upfront capital.'
        },
        {
          category: 'franchises',
          q: 'How does a franchise protected territory relate to your commercial lease?',
          a: 'Franchise agreements typically grant a protected geographic radius or postal boundary within which another same-brand outlet cannot open. Always confirm before signing a lease that your address respects neighbouring franchisees’ territories and that total lease length (initial term plus options) aligns with your franchise term.'
        },
        {
          category: 'pourvoiries',
          q: 'How is a Government of Quebec exclusive hunting and fishing rights lease transferred when buying an outfitter?',
          a: 'In Quebec, an outfitter with exclusive rights (pourvoirie à droits exclusifs) operates under a provincial government lease (MRNF / MELCCFP). Neither the exclusive territory lease nor leased Crown land transfers automatically like private land: the purchase offer must be conditional on formal ministerial approval of the lease and permit transfer.'
        },
        {
          category: 'pourvoiries',
          q: 'What is the difference between an exclusive-rights outfitter and a non-exclusive outfitter?',
          a: 'An exclusive-rights outfitter holds a defined public-land territory with exclusive commercial rights for hunting, fishing, and trapping. A non-exclusive outfitter generally operates on private parcels or borders public waterways without exclusive wildlife territory rights; asset valuation, annual fees, and transfer rules differ substantially.'
        },
        {
          category: 'pourvoiries',
          q: 'How are cabins, boats, motors, vehicles, and equipment allocated in an outfitter sale?',
          a: 'An outfitter transaction typically blends real estate (private land, main lodge, cabins, service buildings), operating rights (exclusive lease, permits, goodwill, website), and extensive movable inventory (boats, outboards, ATVs, snowmobiles, generators, furnishings). Accurate asset allocation in the offer directly affects financing, welcome tax, and GST/QST treatment.'
        },
        {
          category: 'pourvoiries',
          q: 'What environmental and technical inspections are essential before purchasing an outfitter?',
          a: 'Due diligence must cover septic system compliance (Quebec Q-2, r. 22), potable water treatment and testing, fuel storage tanks (gasoline, diesel, propane) and potential soil contamination, off-grid or utility power infrastructure (solar, generators, Hydro lines), and the condition of docks, dams, and culverts.'
        },
        {
          category: 'pourvoiries',
          q: 'How are outfitter acquisitions financed in Quebec and why is a specialized appraiser needed?',
          a: 'Few conventional lenders finance remote tourism assets without specialized underwriting. Commercial banks, BDC, or regional lenders typically require a higher down payment (often 25% to 40%+ depending on the share of movable assets and rights), three years of financial statements, a solid business plan, and a certified appraisal by an É.A. experienced in outfitters.'
        },
        {
          category: 'pourvoiries',
          q: 'How do road access versus floatplane access and forestry road maintenance affect profitability?',
          a: 'Road-accessible outfitters serve a broader family and vacation market but depend on shared maintenance and grading costs on multi-resource forestry roads and bridges. Fly-in outfitters command exclusive premium pricing and remote wilderness appeal, while requiring careful aviation logistics and seasonal supply planning.'
        },
        {
          category: 'pourvoiries',
          q: 'Which CITQ tourism permits and wildlife reporting obligations transfer to the new operator?',
          a: 'Operators must keep their Quebec tourist accommodation registration (CITQ) up to date alongside their outfitter permit, food/liquor licences if operating a lodge restaurant, and mandatory wildlife harvest registers. As a member of the Quebec Outfitters Federation (FPQ), Himalaya guides buyers and sellers through every step.'
        },
        {
          category: 'campings',
          q: 'Why does the mix of seasonal versus transient campsites strongly affect a campground’s value?',
          a: 'Seasonal sites provide predictable recurring revenue often collected before summer, insulating cash flow from rainy weekends. Transient RV sites and ready-to-camp units command higher nightly yields but require active reservation management and marketing. A healthy balance boosts cash-flow stability and lender confidence.'
        },
        {
          category: 'campings',
          q: 'How is the fair market value of a Quebec campground determined (EBITDA vs land value)?',
          a: 'Campgrounds are valued primarily on normalized operating profitability (EBITDA / net operating income before debt service and discretionary owner expenses) multiplied by a market capitalization or earnings multiple, while accounting for underlying land value (acreage, waterfront footage, expansion potential) and recent capital improvements.'
        },
        {
          category: 'campings',
          q: 'What infrastructure and regulatory checks are critical before buying a campground?',
          a: 'Buyers should verify water supply capacity, wells, and wastewater/septic systems relative to total 2-service and 3-service sites, electrical distribution capacity (15/30/50-amp hookups for modern RVs), floodplain and shoreline setback maps, municipal and CPTAQ agricultural zoning where applicable, and valid CITQ registration.'
        },
        {
          category: 'campings',
          q: 'When is the best season to inspect and close on a campground acquisition?',
          a: 'Although closings frequently happen between late fall and early spring so the new owner can prepare for opening day, physical inspection of water pumps, distribution lines, electrical pedestals, roads, and washrooms is best performed while the campground is operating between May and October.'
        },
        {
          category: 'campings',
          q: 'What financing terms and down payment are typical when purchasing a campground?',
          a: 'Commercial lenders and BDC review three years of normalized financial statements, operational experience, a certified appraisal, and underground infrastructure longevity. Depending on transaction size and whether an owner residence is included, required down payments usually fall between 25% and 35%.'
        },
        {
          category: 'campings',
          q: 'Can you expand an existing campground by adding RV sites or ready-to-camp cabins?',
          a: 'Expansion is never automatic: before paying a premium for undeveloped acreage, confirm acquired rights versus current municipal zoning, provincial wastewater treatment capacity permits, and any CPTAQ or shoreline restrictions governing additional RV pads, chalets, or glamping units.'
        },
        {
          category: 'multilogement',
          q: 'What is the main financing and valuation difference between 2–4 units and 5+ unit buildings?',
          a: 'Plexes with 2 to 4 units (duplexes, triplexes, fourplexes) are typically financed under residential underwriting based on personal borrower income and evaluated using comparable sales. At 5 units and above, financing shifts to commercial underwriting: valuation is driven primarily by Net Operating Income (income approach) and Debt Coverage Ratio (DCR).'
        },
        {
          category: 'multilogement',
          q: 'How do Capitalization Rate (Cap Rate / TGA) and Gross Rent Multiplier (GRM / MRB) work?',
          a: 'GRM divides the asking price by gross annual rental revenue to give a quick surface comparison without accounting for expenses. Cap Rate divides Net Operating Income (NOI) by property value (or Value = NOI / Cap Rate), making it the benchmark metric used by commercial lenders, institutional investors, and chartered appraisers for 5+ unit buildings.'
        },
        {
          category: 'multilogement',
          q: 'What advantages does CMHC-insured multi-unit financing (including MLI Select) offer?',
          a: 'For 5+ unit properties, CMHC insurance unlocks lower interest rates, higher loan-to-value ratios (lower down payment), and longer amortizations compared to conventional commercial loans. Under CMHC’s MLI Select program, projects meeting affordability, energy-efficiency, and accessibility point thresholds can qualify for extended amortizations up to 40 or 50 years.'
        },
        {
          category: 'multilogement',
          q: 'How do Tribunal administratif du logement (TAL) rules impact rent increases and building value?',
          a: 'In Quebec, residential lease renewals and rent adjustments follow TAL criteria reflecting property taxes, insurance, energy expenses, and amortized major capital work. Newly built properties (completed 5 years ago or less) may qualify for a temporary rent-setting exemption under Article 1955 C.C.Q. if properly disclosed in the lease—a critical verification item.'
        },
        {
          category: 'multilogement',
          q: 'What documents and physical elements should be reviewed during multi-family due diligence?',
          a: 'Thorough due diligence covers all active leases and notices, actual rent rolls, municipal and school tax bills, Hydro-Québec and gas energy histories, maintenance contracts (snow removal, elevator), capital repair invoices, an updated certificate of location, and a building inspection covering roof, masonry, plumbing, electrical panels, foundation, and Phase I environmental checks.'
        },
        {
          category: 'multilogement',
          q: 'Why does a lender’s economic value often differ from a seller’s stated expenses?',
          a: 'Even when an owner self-manages snow clearing, janitorial care, or minor repairs without taking a salary, lenders and appraisers apply standardized operating expense norms (management fee, concierge, structural maintenance reserve, and market vacancy allowance). Stress-testing NOI with normalized expenses avoids overestimating true maximum financing.'
        },
        {
          category: 'multilogement',
          q: 'What closing costs and sales taxes apply when purchasing a multi-family building in Quebec?',
          a: 'Buyers should budget for municipal land transfer taxes (welcome tax), notary fees, certified appraisal, and commercial due-diligence reports (Phase I environmental, building condition, certificate of location) commonly required for 5+ units. Long-term residential rents are exempt from GST/QST, unless the property is newly built or includes a commercial ground-floor component.'
        }
      ]
    },

    links: {
      heading: 'Real Estate Links & Partner Network',
      subtitle: 'Official government directories and multidisciplinary professional partners in Canada and internationally.',
      govTitle: 'Government Information Portals (Quebec & Canada)',
      govLinks: [
        {
          name: 'Registraire des entreprises du Québec',
          desc: 'Corporate registry, legal entities, and directors in Quebec',
          url: 'https://www.quebec.ca/entreprises-et-travailleurs-autonomes/obtenir-renseignements-entreprise/recherche-registre-entreprises/acceder-registre-entreprises'
        },
        {
          name: 'Registre foncier du Québec (Land Register)',
          desc: 'Official land registry for property titles and transactions in Quebec',
          url: 'https://www.registrefoncier.gouv.qc.ca'
        },
        {
          name: 'Corporations Canada',
          desc: 'Federal corporate registry and business directory',
          url: 'https://ised-isde.canada.ca/site/corporations-canada/en'
        },
        {
          name: 'Quebec Municipalities Directory (MAMH)',
          desc: 'Municipal assessments, property taxes, and zoning by-laws',
          url: 'https://www.quebec.ca/gouvernement/portrait-quebec/repertoire-municipalites'
        },
        {
          name: 'Agricultural Land Protection Commission (CPTAQ)',
          desc: 'Agricultural zoning, authorizations, and interactive maps',
          url: 'https://www.cptaq.gouv.qc.ca'
        },
        {
          name: 'Flood Zone Mapping (Géo-Inondations Québec)',
          desc: 'Official flood zone maps and hydrological atlas of Quebec',
          url: 'https://zonesinondables.mrnf.gouv.qc.ca/'
        },
        {
          name: 'Quebec School Service Centres / School Taxes',
          desc: 'Directory of school service centres and school tax jurisdictions',
          url: 'https://www.fcssq.quebec'
        },
        {
          name: 'Cultural Heritage Directory of Quebec',
          desc: 'Heritage properties, classified sites, and protection areas',
          url: 'https://www.patrimoine-culturel.gouv.qc.ca'
        }
      ],
      partnersTitle: 'Multidisciplinary Partners (Canada & International)',
      partnerGroups: [
        {
          category: 'Lawyers — Commercial Law & Franchising',
          items: [
            {
              name: 'FASKEN Lawyers — Frédéric P. Gilbert, B.A., LL.B.',
              specialty: 'Patent & Trademark Agents, Commercial & Franchise Law',
              address: 'Stock Exchange Tower, 800 Square-Victoria St., Suite 3700, Montreal, QC H2Z 1E9',
              contact: '514-397-5232 • fgilbert@fasken.com',
              website: 'https://www.fasken.com/en'
            },
            {
              name: 'Tutino Joseph Grégoire Lawyers — Isabelle Grégoire, Partner',
              specialty: 'Latent defects, franchises, and commercial leases',
              address: '1080 Côte du Beaver Hall, Suite 600, Montreal, QC H2Z 1S8',
              contact: '514-878-3878 • igregoire@tutinolex.com',
              website: 'https://tutinolex.com'
            },
            {
              name: 'GAO Avocat inc. — Yuan Znan Gao, LL.B., J.D., TEP',
              specialty: 'Business and real estate law',
              address: '6955 Taschereau Blvd., Suite 106, Brossard, QC J4Z 1A7',
              contact: '514-518-0880 • gao.avocat@gmail.com'
            }
          ]
        },
        {
          category: 'Land Surveyors',
          items: [
            {
              name: 'Stéphan Roy, Land Surveyor (Groupe SR)',
              specialty: 'Certificates of location, staking, and land surveying',
              address: '255 Curé-Labelle Blvd., Suite 100, Laval, QC H7L 2Z9',
              contact: '514-990-2333 • info@groupesr.ca',
              website: 'https://www.groupesr.ca'
            }
          ]
        },
        {
          category: 'Chartered Appraisers (Outfitters & Commercial)',
          items: [
            {
              name: 'André Leblanc et Ass. — Marc-André Leblanc, CMA, É.A.',
              specialty: 'Chartered Appraiser — Outfitters and commercial properties',
              address: '2965 Boischatel, Trois-Rivières, QC G8Z 3Z8',
              contact: '819-373-6579 • maleblanc@aleblanc-ea.com',
              website: 'https://www.aleblanc-ea.com'
            },
            {
              name: 'Jean Philippe Baril, B.A.A., É.A., AACI, P.App. (Baril Évaluation)',
              specialty: 'Chartered Appraiser — Outfitters and commercial properties',
              address: '141 Bonaventure St., Trois-Rivières, QC G9A 2A9',
              contact: '819-373-1401 / 1-866-373-1401 • info@barilevaluation.com',
              website: 'https://barilevaluation.com'
            }
          ]
        },
        {
          category: 'Environmental Services (Soil Analysis & Site Assessment)',
          items: [
            {
              name: 'Physis Environnement Inc. — François Munger, Chemist',
              specialty: 'Environmental soil and equipment analysis',
              address: 'Montreal, Quebec',
              contact: '514-516-2255 • fmunger@physisenvironnement.com',
              website: 'https://www.physis.ca'
            },
            {
              name: 'MultiTEST — Krystel Segura, M.Sc., Vice-President',
              specialty: 'Environmental site assessments and characterization',
              address: '464 Roland-Therrien Blvd., Longueuil, QC J4H 3V9',
              contact: '514-990-2063 • info@multitest.ca',
              website: 'https://www.multitest.ca'
            }
          ]
        },
        {
          category: 'Franchise Consultants, Geomarketing & Commercial Design',
          items: [
            {
              name: 'Imagine Franchise Consultant — Stéphane Breault, President',
              specialty: 'Franchise consulting and network development',
              address: '1751 Richardson St., Suite 4.509, Montreal, QC H3K 1G6',
              contact: '514-935-5686 ext. 229 • sbreault@imagine-fl.com',
              website: 'https://www.imaginefranchise.com'
            },
            {
              name: 'Indicia Geomarketing — Daniel Lemire, President',
              specialty: 'Market studies and commercial geomarketing',
              address: '3467 des Entreprises Blvd., Suite 103, Terrebonne, QC J6X 4J9',
              contact: '450-477-3330 • daniel.lemire@indicia.ca',
              website: 'https://indicia.ca'
            },
            {
              name: 'DSD Groupe Design — Dimitri Smolens, APDIQ, DIC',
              specialty: 'Commercial space planning and interior design',
              address: '2197 Sherbrooke St. East, Suite 010, Montreal, QC H2K 1C8',
              contact: '514-985-5320 • dsmolens@groupedesign.com',
              website: 'https://groupedesign.com'
            }
          ]
        },
        {
          category: 'International Partners (Dominican Republic)',
          items: [
            {
              name: 'Dominican Republic — Wilfredo Mena & Asocs. / Revart',
              specialty: 'Architecture, construction, and project supervision',
              address: 'Dominican Republic',
              contact: '809-788-0121 / 829-601-6745'
            }
          ]
        }
      ]
    }
  }
};

ABOUT_CONTENT.ES = {
  pageTitle: 'Nosotros',
  pageSubtitle: 'Desde 2008, Immobilier Himalaya Real Estate Corp. acompaña a sus clientes en Quebec, Canadá y a nivel internacional.',
  tabs: [
    { id: 'qui-nous-sommes', label: 'Quiénes somos' },
    { id: 'co-fondateurs', label: 'Cofundadores' },
    { id: 'services', label: 'Servicios y Asociaciones' },
    { id: 'franchises', label: 'Franquicias' },
    { id: 'carrieres', label: 'Carreras y Afiliados' },
    { id: 'faq', label: 'Preguntas frecuentes' },
    { id: 'liens', label: 'Socios y Enlaces' }
  ],
  whoWeAre: {
    heading: 'Quiénes somos',
    intro:
      'Desde su fundación en 2008, la agencia inmobiliaria Himalaya se ha consolidado como líder en bienes raíces en Quebec, en Canadá y en todo el mundo. Nuestros clientes, provenientes de diversos sectores, nos eligen por nuestra red internacional de contactos, nuestro profundo conocimiento de las transacciones inmobiliarias, nuestra integridad y nuestro destacado servicio al cliente. Cada miembro de nuestro equipo se compromete a atender adecuadamente a nuestros clientes, ofreciendo una amplia selección de propiedades de calidad en venta o alquiler en los sectores comercial, residencial e industrial.',
    profileTitle: 'NUESTRO PERFIL',
    profileParagraphs: [
      'Immobilier Himalaya Real Estate Corp. es una agencia inmobiliaria internacional activa en el corretaje inmobiliario comercial, industrial y de inversión residencial. Su sede central está ubicada en Quebec (Canadá).',
      'Reunimos a un equipo multicultural de corredores inmobiliarios profesionales e íntegros que trabajan incansablemente para satisfacer las necesidades de nuestros clientes de manera óptima. Nuestros corredores eligen Himalaya porque desean alcanzar nuevos niveles de excelencia y formar parte de un equipo comprometido y de alto rendimiento.',
      'No solo seleccionamos a nuestros corredores por su competencia y experiencia, sino también por su sentido ético, su integridad y su constante búsqueda de mejores soluciones para nuestros clientes.',
      'Para nosotros es esencial crear y mantener vínculos duraderos con los distintos actores de nuestra industria. Mantenemos excelentes relaciones de trabajo con usuarios y gestores de espacios comerciales, promotores inmobiliarios, agencias de corretaje, firmas de administración inmobiliaria e instituciones financieras.'
    ],
    missionTitle: 'NUESTRA MISIÓN',
    missionText:
      'Favorecer la conclusión de transacciones justas y honestas, cultivar relaciones profesionales a largo plazo, ser el recurso inmobiliario local para todas las necesidades de nuestra clientela y ofrecer una red internacional.',
    valuesTitle: 'NUESTROS VALORES',
    valuesList: ['Colaboración', 'Comunicación', 'Escucha', 'Respeto', 'Ética'],
    valuesText:
      'La colaboración, la comunicación, la escucha activa, el respeto y la ética son valores fundamentales en Immobilier Himalaya en todas nuestras transacciones inmobiliarias.',
    contactCta: 'Contáctenos: ¡será un placer conversar con usted sobre su proyecto inmobiliario!'
  },
  coFounders: {
    heading: 'Una agencia inmobiliaria dirigida por profesionales apasionados',
    intro:
      'Immobilier Himalaya fue fundada por dos colaboradores de larga trayectoria que comparten, desde su primer encuentro en 1998, los mismos valores de respeto, integridad, comunicación y excelencia. Para Geniev Mondoux y Roger Rhéaume, un proceso inmobiliario no es simplemente una transacción: es una oportunidad para crear lazos, unir a las personas y ofrecer a sus clientes la posibilidad de hacer realidad los proyectos que más les importan.',
    founders: [
      {
        id: 'geniev-mondoux',
        name: 'Geniev Mondoux',
        role: 'Vicepresidente — Corredor inmobiliario certificado',
        credentials: 'CPA, MBA • Cofundador y Director de agencia',
        portrait: '/DATA/COURTIERINFOSUP/11_courtierGrand.JPG',
        photos: [
          '/DATA/CMSIMAGE/721.jpg',
          '/DATA/CMSIMAGE/722.jpg'
        ],
        paragraphs: [
          'Hombre de familia que sitúa la integridad y el respeto por encima de todo, Geniev Mondoux es Contador Profesional Certificado (CPA), posee una Maestría en Administración de Empresas (MBA), y es emprendedor y creador de oportunidades. Su vocación por el trato humano y las relaciones duraderas lo llevó a iniciar su carrera inmobiliaria en 2008. Apasionado por su profesión y motivado cada día por los vínculos que construye, Geniev dedica todo su esfuerzo a brindar un servicio impecable a sus clientes. Su mayor fortaleza es innovar y encontrar soluciones concretas para llevar a buen término cualquier transacción inmobiliaria. Su gran capacidad de escucha, cercanía y cordialidad, combinadas con su competencia y amplia experiencia, lo convierten en un socio muy solicitado en numerosos proyectos inmobiliarios.',
          'Cofundador de Himalaya junto a su socio de larga data, Roger Rhéaume, y director ejecutivo de la agencia dentro del grupo, Geniev supera con éxito los desafíos más complejos y logra siempre encontrar soluciones concretas y obtener resultados óptimos.',
          'Impulsado por sólidos valores familiares y comprometido con mantener el respeto y la integridad en todas las esferas de su vida, Geniev es una persona cálida y cercana que siempre genera un ambiente de confianza entre clientes y colegas.'
        ]
      },
      {
        id: 'roger-rheaume',
        name: 'Roger Rhéaume',
        role: 'Presidente — Corredor inmobiliario certificado, DA',
        credentials: 'Cofundador • Exmiembro del Consejo de Administración de la OACIQ',
        portrait: '/DATA/COURTIERINFOSUP/99_courtierGrand.jpg',
        photos: [
          '/DATA/CMSIMAGE/200.jpg',
          '/DATA/CMSIMAGE/201.jpg',
          '/DATA/CMSIMAGE/202.jpg'
        ],
        sections: [
          {
            subtitle: 'Una vida apasionante — « ¡Solo vivimos una vez en la tierra y quiero aprovecharla al máximo! »',
            paragraphs: [
              'Comencé a hacer senderismo de montaña y a visitar numerosos países desde los 18 años. Para mí, la montaña representa la aventura, el silencio y una fuente de energía y respeto. Escalé hasta los 5 785 metros de altitud para contemplar el monte Everest, situado en la cordillera más hermosa del mundo: el Himalaya. ¡Qué gran regalo pude hacerme para mis 50 años!',
              'Ya sea en las montañas de Europa, Asia, África o América, las he recorrido todas y he conocido a las personas que allí habitan. Para mí, el mundo es infinito y hermoso. Desde hace más de 50 años viajo para admirar nuestro planeta, conocer a sus pueblos, sus vidas y sus costumbres. La mayor riqueza que poseo es el amor y la amistad.'
            ]
          },
          {
            subtitle: 'La pasión por el sector inmobiliario',
            paragraphs: [
              'Mi experiencia previa en el ámbito del comercio y los servicios me llevó a desarrollarme en el corretaje inmobiliario comercial. Adquirí más de 20 años de experiencia antes de fundar, junto a mi socio, nuestra firma de corretaje: Immobilier Himalaya Real Estate Corp. El sector inmobiliario es una verdadera pasión para mí. Formé parte del Consejo de Administración de la OACIQ durante 3 años, integré durante más de 5 años el Consejo del Collège Immobilier du Québec y fui Presidente del Comité Comercial de la CIGM durante más de 6 años. En 2022 abrí una oficina de corretaje inmobiliario en México junto a mi socio Fabien Herman para ayudar a inversionistas quebequenses y franceses a adquirir propiedades, además de establecer relaciones comerciales con corredores en la República Dominicana.',
              'Mi pasión me ha llevado a impartir formaciones y conferencias a corredores para que todos estén mejor informados. Como gran viajero, he combinado mi trabajo con los viajes internacionales, teniendo presencia activa en varios países como corredor inmobiliario para captaciones y proyectos de desarrollo inmobiliario.'
            ]
          }
        ]
      }
    ]
  },
  services: {
    heading: 'Servicios inmobiliarios que destacan por su excelencia',
    intro1:
      'Immobilier Himalaya es el socio de elección para cualquier transacción inmobiliaria. Nuestra presencia en varios países, así como nuestra experiencia y saber hacer, nos permiten guiar profesionalmente a nuestros clientes en sus proyectos inmobiliarios y actuar como asesores de confianza en los sectores comercial, residencial e industrial.',
    intro2:
      'Nuestro equipo le ofrece una gama completa de servicios de corretaje inmobiliario. Nuestro amplio conocimiento del mercado y nuestra experiencia juegan a su favor para lograr resultados óptimos a la altura de sus expectativas. Recurra a los corredores inmobiliarios de Himalaya para los siguientes servicios:',
    brokerageTitle: 'Venta, alquiler y búsqueda de propiedades comerciales e industriales',
    brokerageItems: [
      'Oficinas y locales comerciales',
      'Edificios comerciales y de renta',
      'Propiedades multifamiliares',
      'Empresas y fondos de comercio',
      'Cotos de caza y pesca (pourvoiries) y campings',
      'Hotelería y complejos turísticos',
      'Terrenos para desarrollo',
      'Franquicias y licencias',
      'Venta y búsqueda de inversiones residenciales',
      'Desarrollo de proyectos comerciales e industriales'
    ],
    consultingTitle: 'Consultoría inmobiliaria',
    advisoryTitle: 'Consultoría inmobiliaria',
    consultingItems: [
      'Análisis e identificación de necesidades',
      'Análisis de mercado y sector',
      'Evaluación de oportunidades y amenazas',
      'Análisis y recomendación de alternativas',
      'Análisis y recomendación de servicios profesionales complementarios',
      'Renovación de contratos de arrendamiento comerciales e industriales',
      'Proyectos de comercialización de condominios',
      'Vinculación y contacto con nuestra red internacional'
    ],
    advisoryItems: [
      'Análisis e identificación de necesidades',
      'Análisis de mercado y sector',
      'Evaluación de oportunidades y amenazas',
      'Análisis y recomendación de alternativas',
      'Análisis y recomendación de servicios profesionales complementarios',
      'Renovación de contratos de arrendamiento comerciales e industriales',
      'Proyectos de comercialización de condominios',
      'Vinculación y contacto con nuestra red internacional'
    ],
    internationalTitle: 'Corretaje inmobiliario internacional',
    internationalText:
      'Para servir mejor a nuestra clientela, hemos desarrollado sólidas relaciones comerciales a nivel internacional y conocemos en profundidad el mercado inmobiliario de numerosos países. Nuestra confiable red de contactos nos permite guiarle hacia las mejores oportunidades inmobiliarias. Para obtener más información, contáctenos: ¡estaremos encantados de reunirnos con usted para conversar sobre su proyecto y sus aspiraciones!',
    associationsTitle: 'Asociaciones de las que somos miembros',
    associationsText:
      'Immobilier Himalaya es miembro de la Asociación Profesional de Corredores Inmobiliarios de Quebec (APCIQ), del Consejo Quebequense de la Franquicia (CQF), de ICSC, de la Federación de Cotos de Caza y Pesca de Quebec (FPQ) y de Camping Québec. Esto nos permite ofrecer un servicio óptimo a nuestros clientes que buscan oportunidades de venta, compra o alquiler en el sector comercial, especialmente en cotos turísticos, campings, comercio minorista y restauración.',
    associationsIntro:
      'Immobilier Himalaya es miembro de la APCIQ, del Consejo Quebequense de la Franquicia (CQF), de ICSC, de la Federación de Cotos de Caza y Pesca de Quebec (FPQ) y de Camping Québec.',
    associationsBadges: [
      { code: 'OACIQ', name: 'Organismo de Autorregulación del Corretaje Inmobiliario de Quebec (OACIQ)' },
      { code: 'APCIQ', name: 'Asociación Profesional de Corredores Inmobiliarios de Quebec (APCIQ)' },
      { code: 'FPQ', name: 'Federación de Cotos de Caza y Pesca de Quebec (FPQ)' },
      { code: 'Camping Québec', name: 'Asociación de Terrenos de Camping de Quebec' },
      { code: 'CQF', name: 'Consejo Quebequense de la Franquicia (CQF)' },
      { code: 'ICSC', name: 'International Council of Shopping Centers (Innovating Commerce Serving Communities)' }
    ],
    associations: [
      { code: 'OACIQ', name: 'Organismo de Autorregulación del Corretaje Inmobiliario de Quebec (OACIQ)' },
      { code: 'APCIQ', name: 'Asociación Profesional de Corredores Inmobiliarios de Quebec (APCIQ)' },
      { code: 'FPQ', name: 'Federación de Cotos de Caza y Pesca de Quebec (FPQ)' },
      { code: 'Camping Québec', name: 'Asociación de Terrenos de Camping de Quebec' },
      { code: 'CQF', name: 'Consejo Quebequense de la Franquicia (CQF)' },
      { code: 'ICSC', name: 'International Council of Shopping Centers (Innovating Commerce Serving Communities)' }
    ]
  },
  careers: {
    brokerHeading: 'Conviértase en corredor inmobiliario en Himalaya',
    brokerParagraphs: [
      'Desde su fundación en 2008, Immobilier Himalaya Real Estate Corp. se ha convertido en sinónimo de profundo conocimiento del sector inmobiliario comercial, industrial y residencial. Es reconocida por su honestidad, su integridad y su excepcional servicio al cliente, cualidades que fomentan la colaboración, el respeto y el éxito en las transacciones.',
      'Al unirse a nuestra agencia como corredor inmobiliario, se beneficiará de los privilegios y la red de contactos que hemos construido a lo largo de los años. También aprovechará nuestras herramientas y formará parte integral de un equipo colaborativo que se apoya mutuamente. Gracias a Immobilier Himalaya Real Estate Corp., destacará a escala nacional e internacional.',
      'Tanto si es un corredor inmobiliario con experiencia como si desea perfeccionarse en este sector de la industria inmobiliaria, Immobilier Himalaya Real Estate Corp. estará encantada de darle la bienvenida a su equipo.'
    ],
    brokerBenefitsTitle: 'Ventajas ofrecidas a los corredores de Himalaya',
    brokerBenefits: [
      'Formación, reuniones y seminarios mensuales',
      'Estructura de costos reducida y ventajosa',
      'Equipo íntegro y profesional',
      'Red y oportunidades de desarrollo internacional',
      'Sitio web multicultural y multilingüe',
      'Socios multidisciplinarios (abogados, notarios, tasadores, expertos ambientales)',
      'Imagen prestigiosa y dirección en el centro de Montreal (2000 av. McGill College)',
      'Acceso en línea a una oficina virtual (correo electrónico, documentos, red de contactos, etc.)'
    ],
    affiliateHeading: 'Conviértase en afiliado de una agencia inmobiliaria de primer nivel',
    affiliateParagraphs: [
      'Immobilier Himalaya Real Estate Corp. goza de una envidiable reputación de excelencia inmobiliaria en Canadá y a nivel internacional. Nuestro servicio inigualable, sentido ético y profesionalismo nos convierten en el socio ideal para sus negocios.',
      'Al convertirse en agencia afiliada, se beneficiará de las ventajas de nuestras redes nacional e internacional, así como de los privilegios adquiridos durante años de trabajo riguroso, íntegro y dedicado. La colaboración y el apoyo mutuo están en el corazón de nuestra filosofía empresarial y todas nuestras agencias afiliadas reciben un respaldo óptimo.',
      'Immobilier Himalaya desea asociarse con agencias inmobiliarias profesionales de diferentes países y culturas para continuar su expansión internacional.'
    ],
    affiliateBenefitsTitle: 'Ventajas para las agencias afiliadas',
    affiliateBenefits: [
      'Red internacional consolidada',
      'Visibilidad internacional multilingüe',
      'Estructura de costos optimizada',
      'Equipo íntegro y profesional',
      'Imagen prestigiosa y sede en el centro de Montreal',
      'Acceso en línea a una oficina virtual (correo electrónico, documentos, red de contactos, etc.)'
    ],
    contactNote: 'Comuníquese con Geniev Mondoux o Roger Rhéaume para obtener más información.',
    applyBtn: 'Contactar a la dirección (Geniev Mondoux y Roger Rhéaume)'
  },
  faq: {
    heading: 'Preguntas frecuentes — Por especialidad inmobiliaria',
    subtitle: 'Respuestas detalladas sobre alquiler comercial, oficinas, franquicias, cotos turísticos (pourvoiries), campings y multifamiliares en Quebec.',
    categories: [
      { id: 'all', label: 'Todas las preguntas' },
      { id: 'locations', label: 'Alquiler comercial' },
      { id: 'bureaux', label: 'Oficinas comerciales' },
      { id: 'franchises', label: 'Franquicias' },
      { id: 'pourvoiries', label: 'Pourvoiries' },
      { id: 'campings', label: 'Campings' },
      { id: 'multilogement', label: 'Multifamiliar' }
    ],
    items: [
      {
        category: 'locations',
        q: '¿Qué es el alquiler base (renta base)?',
        a: 'El alquiler base es la porción de la renta que se paga en función del número de pies cuadrados utilizados y/o el espacio arrendado incluyendo las áreas comunes, lo cual corresponde al valor inmobiliario del local.'
      },
      {
        category: 'locations',
        q: '¿Qué es el alquiler adicional (renta adicional)?',
        a: 'El alquiler adicional representa los gastos de operación y administración del local y del edificio (electricidad, impuestos municipales, mantenimiento, seguros, etc.), calculados también en función de los pies cuadrados utilizados y las áreas comunes.'
      },
      {
        category: 'locations',
        q: '¿Se puede negociar el alquiler comercial?',
        a: 'Todo es negociable: tanto el alquiler base como el alquiler adicional, así como el período de instalación y las mejoras locativas.'
      },
      {
        category: 'locations',
        q: '¿Conviene negociar un contrato de arrendamiento a corto o a largo plazo?',
        a: 'Para una empresa en fase de arranque, la duración del contrato debe ser lo más corta posible a fin de minimizar sus compromisos si el proyecto no resulta como se esperaba, especialmente si usted avala personalmente el contrato. Un arrendamiento de cinco años o más es ventajoso para empresas consolidadas porque permite obtener mejores precios y condiciones.'
      },
      {
        category: 'locations',
        q: '¿Existen otros métodos para evaluar la duración de un contrato de arrendamiento?',
        a: 'Según la inversión monetaria que el nuevo inquilino deba realizar en mejoras locativas y el número de años durante los cuales se amortizarán dichas mejoras, se puede determinar el número mínimo de años necesario para alcanzar la rentabilidad.'
      },
      {
        category: 'locations',
        q: '¿Qué significa el período de «instalación»?',
        a: 'La instalación es un período que se concede para que el inquilino instale todo su equipamiento a fin de poner en marcha su negocio. Por lo general, el arrendador otorga un período libre de renta (varias semanas o meses) según el tipo de comercio. El inquilino debe contar con un seguro desde el inicio de la instalación para protegerse en caso de siniestro o accidente.'
      },
      {
        category: 'locations',
        q: '¿El derecho de permanencia en el local es automático?',
        a: 'A diferencia del alquiler residencial, la renovación de un contrato de arrendamiento comercial se negocia desde el principio. Contar con una o varias opciones de renovación es fundamental para el inquilino, tanto para la continuidad de su negocio como para la futura venta de su empresa.'
      },
      {
        category: 'locations',
        q: '¿Por qué incluir una opción de renovación?',
        a: 'Las opciones de renovación son importantes porque el acondicionamiento de un local comercial es costoso y su ubicación es estratégica. También debemos tener en cuenta la posible venta futura de la empresa en función de su mercado y sus competidores.'
      },
      {
        category: 'locations',
        q: '¿La opción de renovación es una obligación?',
        a: 'No, una opción de renovación es un derecho negociado previamente, no una obligación. El contrato de arrendamiento especifica cuántos meses antes del vencimiento del plazo el inquilino puede ejercer su opción o rechazarla y retirarse.'
      },
      {
        category: 'locations',
        q: '¿Mi corredor inmobiliario puede negociar mi contrato de arrendamiento?',
        a: 'Los servicios de un buen corredor inmobiliario comercial son sumamente útiles para su empresa. Es importante asegurarse de que posea experiencia y conocimientos en arrendamientos comerciales, ya que un contrato comercial compromete al arrendador y al inquilino durante un largo período de tiempo.'
      },
      {
        category: 'locations',
        q: '¿Cuántos corredores son profesionales del sector inmobiliario comercial e industrial?',
        a: 'De los aproximadamente 17 000 corredores inmobiliarios en Quebec, menos del 6 % son profesionales del sector comercial e industrial. Este ámbito difiere considerablemente del residencial: no se trata de responder a necesidades personales, sino a exigencias empresariales complejas.'
      },
      {
        category: 'locations',
        q: '¿Los contratos comerciales e industriales son iguales a los contratos residenciales?',
        a: 'Para concretar la venta de un edificio industrial o el arrendamiento de un espacio comercial, no basta con rellenar formularios estándar como en el sector residencial. Cada caso es único y los documentos incluyen numerosas cláusulas específicas de derecho comercial según el tipo de venta o alquiler.'
      },
      {
        category: 'locations',
        q: '¿Cuál es la diferencia entre un contrato bruto, semibruto y triple neto (NNN)?',
        a: 'En un contrato bruto, la renta mensual incluye la mayoría de los gastos operativos (impuestos, seguros, mantenimiento). En un contrato semibruto, el inquilino suele pagar su electricidad, limpieza o los incrementos de impuestos sobre un año base. En un contrato triple neto (NNN), el inquilino paga el alquiler base más su proporción íntegra de impuestos inmobiliarios, seguros del edificio y gastos de áreas comunes (CAM), a veces incluyendo gestión.'
      },
      {
        category: 'locations',
        q: '¿Puedo ceder mi contrato de arrendamiento o subarrendar si vendo mi negocio?',
        a: 'La mayoría de los contratos comerciales permiten la cesión o el subarriendo con el consentimiento previo del arrendador, quien por lo general no puede negarse sin motivo justificado. Es fundamental negociar desde el principio condiciones claras de cesión y, de ser posible, la liberación de la garantía personal del vendedor.'
      },
      {
        category: 'locations',
        q: '¿Para qué sirve una cláusula de exclusividad (no competencia) en un contrato comercial?',
        a: 'En un centro comercial o edificio de múltiples inquilinos, una cláusula de exclusividad prohíbe al arrendador alquilar otro local a un competidor directo con la misma actividad principal (por ejemplo, otro restaurante italiano, cafetería o clínica dental). Esta protección resguarda su clientela y el valor de reventa del negocio.'
      },
      {
        category: 'locations',
        q: '¿Los alquileres comerciales están sujetos a impuestos sobre las ventas (TPS/TVQ) y depósito de garantía?',
        a: 'Sí. A diferencia del alquiler residencial, los arrendamientos comerciales, de oficinas e industriales están sujetos a TPS y TVQ tanto sobre el alquiler base como sobre el alquiler adicional. Además, el arrendador suele solicitar un depósito de garantía equivalente a uno o varios meses de renta bruta y una fianza corporativa o personal.'
      },
      {
        category: 'bureaux',
        q: '¿Cuál es la diferencia entre superficie útil y superficie arrendable (factor de áreas comunes)?',
        a: 'La superficie útil mide el espacio privado ocupado por sus despachos y salas de reuniones. La superficie arrendable suma una parte proporcional de las áreas comunes del piso y del edificio (vestíbulos, pasillos, ascensores, baños). Dado que la renta se calcula sobre los pies cuadrados arrendables, es indispensable verificar este factor antes de comparar edificios.'
      },
      {
        category: 'bureaux',
        q: '¿Cómo funcionan las asignaciones para mejoras locativas (TI) y las oficinas llave en mano?',
        a: 'El arrendador puede otorgar una contribución en dólares por pie cuadrado (TI allowance) para financiar tabiques, vidriería, electricidad, cableado y acabados, o entregar la oficina llave en mano conforme a sus planos aprobados. El monto depende directamente de la duración del contrato, la solidez financiera del inquilino y la renta neta acordada.'
      },
      {
        category: 'bureaux',
        q: '¿Cómo negociar plazas de estacionamiento y cargadores eléctricos en un edificio de oficinas?',
        a: 'En las afueras suelen asignarse plazas exteriores según una proporción por cada 1 000 pies², mientras que en el centro urbano las plazas cubiertas se facturan mensualmente aparte. Conviene dejar por escrito en el contrato el número garantizado de plazas, el acceso para visitantes y las tarifas de recarga para vehículos eléctricos.'
      },
      {
        category: 'bureaux',
        q: '¿Qué verificar respecto al sistema HVAC (climatización), electricidad y acceso 24/7?',
        a: 'Los edificios de oficinas suelen operar su climatización central durante el horario laboral estándar (por ejemplo, de lunes a viernes de 7:00 a 18:00). Si su personal trabaja por la noche o fines de semana, verifique la tarifa por hora fuera de horario, el acceso 24/7 mediante tarjeta electrónica y cómo se mide la electricidad de la suite.'
      },
      {
        category: 'bureaux',
        q: '¿Cómo se distinguen los edificios de oficinas de Clase A, B y C?',
        a: 'Los edificios Clase A ofrecen ubicaciones emblemáticas, sistemas mecánicos modernos, certificaciones ambientales (LEED, BOMA BEST), seguridad 24/7 y rentas adicionales más altas. Los Clase B brindan espacios profesionales bien mantenidos con excelente relación calidad-precio, mientras los Clase C ofrecen opciones funcionales más económicas.'
      },
      {
        category: 'bureaux',
        q: '¿Qué es el derecho de primera negativa (ROFR) o de expansión y el subarriendo en oficinas?',
        a: 'Para empresas en crecimiento, el derecho de primera negativa (ROFR) obliga al propietario a ofrecerle prioritariamente un espacio contiguo antes de alquilarlo a un tercero. Combinado con derechos flexibles de subarriendo parcial (muy útiles en el trabajo híbrido), permite adaptar la superficie sin mudarse.'
      },
      {
        category: 'franchises',
        q: '¿Por qué contar con un corredor miembro del CQF para implantar o reubicar una franquicia?',
        a: 'Como miembro oficial del Consejo Quebequense de la Franquicia (CQF), nuestro equipo coordina la relación entre franquiciador, franquiciado y arrendador. Localizamos espacios fuera de mercado o en arterias clave, evaluamos el potencial de ventas y alineamos las cláusulas del contrato de alquiler con el contrato de franquicia.'
      },
      {
        category: 'franchises',
        q: '¿Por qué el franquiciador exige revisar el contrato y tener derecho de intervención (step-in right)?',
        a: 'Debido a que la ubicación comercial es un activo vital de la marca, el franquiciador suele exigir la aprobación previa del contrato y un derecho de intervención (step-in right) para asumir el local o transferirlo a otro franquiciado en caso de incumplimiento. Negociar esto desde la carta de intención evita bloqueos legales.'
      },
      {
        category: 'franchises',
        q: '¿Qué requisitos técnicos diferencian a una franquicia de restauración de una de comercio minorista?',
        a: 'Una franquicia gastronómica requiere mayor capacidad eléctrica y de gas, conducto de extracción comercial hasta el techo, trampa de grasa, zona de carga y, en ocasiones, terraza. El comercio minorista o de servicios prioriza el frente de escaparate, el flujo peatonal, el estacionamiento y la visibilidad en rótulo exterior.'
      },
      {
        category: 'franchises',
        q: '¿Cómo proteger la apertura de una franquicia ante retrasos de permisos municipales o de licor (RACJ)?',
        a: 'El contrato de arrendamiento debe contemplar condiciones suspensivas ligadas a la confirmación de zonificación, permisos de obra, rótulo exterior, terraza y licencia de alcohol (RACJ) cuando corresponda, vinculando además el inicio del pago de renta a un plazo realista de remodelación.'
      },
      {
        category: 'franchises',
        q: '¿Conviene adquirir una franquicia en funcionamiento o abrir una nueva sucursal?',
        a: 'Comprar una franquicia operativa aporta ventas históricas comprobables, equipamiento instalado y clientela establecida, aunque exige revisar el estado de los equipos, los años restantes del alquiler y las renovaciones exigidas por la marca. Abrir una unidad nueva ofrece instalaciones a estrenar, con mayor inversión inicial.'
      },
      {
        category: 'franchises',
        q: '¿Cómo se relaciona la zona de exclusividad territorial de una marca con el alquiler comercial?',
        a: 'El contrato de franquicia suele conceder un radio territorial protegido donde la marca no abrirá otro punto de venta competidor. Antes de firmar el alquiler, verifique que la dirección cumpla los límites territoriales de otros franquiciados y que la duración total del contrato de arrendamiento coincida con la del contrato de franquicia.'
      },
      {
        category: 'pourvoiries',
        q: '¿Cómo se transfiere un arrendamiento gubernamental de derechos exclusivos de caza y pesca en Quebec?',
        a: 'La explotación de una pourvoirie con derechos exclusivos se apoya en un arrendamiento oficial otorgado por el gobierno de Quebec (MRNF / MELCCFP). Estos derechos y tierras públicas no se transfieren automáticamente como un terreno privado: la oferta de compra debe quedar condicionada a la aprobación ministerial formal de transferencia.'
      },
      {
        category: 'pourvoiries',
        q: '¿Cuál es la diferencia entre una pourvoirie con derechos exclusivos y otra sin derechos exclusivos?',
        a: 'Una pourvoirie con derechos exclusivos posee un territorio delimitado sobre tierras públicas donde explota en exclusiva la caza, la pesca y la captura. Una pourvoirie sin derechos exclusivos opera por lo general sobre parcelas privadas o junto a cuerpos de agua públicos sin exclusividad territorial, variando su valoración y régimen.'
      },
      {
        category: 'pourvoiries',
        q: '¿Cómo se distribuyen cabañas, embarcaciones, motores y equipos en el contrato de compraventa?',
        a: 'Una operación de pourvoirie integra bienes raíces (tierras privadas, albergue, cabañas), derechos de explotación (arrendamiento exclusivo, permisos, fondo de comercio) e importante inventario mobiliario (botes, motores fuera de borda, cuatrimotos, motos de nieve, generadores). Su desglose preciso impacta en el financiamiento, impuesto de traspaso y TPS/TVQ.'
      },
      {
        category: 'pourvoiries',
        q: '¿Qué inspecciones técnicas y ambientales son clave antes de comprar una pourvoirie?',
        a: 'La diligencia debida debe verificar la conformidad de sistemas sépticos (norma Q-2, r. 22), análisis de agua potable, tanques de combustible (gasolina, diésel, propano) y calidad de suelo, autonomía eléctrica (solar, generadores o red) y estado de muelles o alcantarillas.'
      },
      {
        category: 'pourvoiries',
        q: '¿Cómo se financia la compra de una pourvoirie y por qué se requiere un tasador especializado?',
        a: 'Pocas entidades financian activos ecoturísticos remotos sin análisis especializado. Bancos comerciales, BDC o financiadores regionales suelen pedir un enganche del 25 % al 40 % o más, tres años de estados financieros, plan de negocios y una tasación certificada elaborada por un É.A. especializado en pourvoiries.'
      },
      {
        category: 'pourvoiries',
        q: '¿Cómo influyen el acceso terrestre vs hidroavión y el mantenimiento de caminos forestales?',
        a: 'El acceso por carretera abre el negocio a familias y turistas regionales, aunque implica costos compartidos de mantenimiento de caminos forestales y puentes. Las pourvoiries accesibles solo en hidroavión ofrecen exclusividad y tarifas más altas, con una logística aérea de suministro más rigurosa.'
      },
      {
        category: 'pourvoiries',
        q: '¿Qué permisos turísticos (CITQ) y registros de fauna deben transferirse o renovarse?',
        a: 'El operador debe mantener vigente su registro de alojamiento turístico (CITQ), el permiso de pourvoirie, licencias de restaurante o bebidas si existe albergue y los registros obligatorios de capturas de fauna. Como miembro de la FPQ, Himalaya orienta al comprador y al vendedor en todo este proceso.'
      },
      {
        category: 'campings',
        q: '¿Por qué la proporción entre campistas de temporada y viajeros influye tanto en el valor de un camping?',
        a: 'Las parcelas de temporada garantizan ingresos recurrentes cobrados al inicio del año, reduciendo el riesgo climático. Los sitios para viajeros y unidades ready-to-camp ofrecen mayor tarifa por noche pero requieren gestión comercial activa. El equilibrio entre ambos segmentos fortalece el flujo de caja.'
      },
      {
        category: 'campings',
        q: '¿Cómo se calcula el valor de mercado de un terreno de camping (EBITDA vs valor del terreno)?',
        a: 'Un camping se valora principalmente por su rentabilidad operativa normalizada (EBITDA / ingreso operativo neto) multiplicada por el múltiplo del sector, ponderando además el valor subyacente del terreno (superficie, frente de lago o río, potencial de expansión) y las inversiones recientes en infraestructura.'
      },
      {
        category: 'campings',
        q: '¿Qué revisiones normativas y de infraestructura resultan indispensables en un camping?',
        a: 'Conviene validar la capacidad de pozos, redes de agua y sistemas sépticos para todos los sitios de 2 y 3 servicios, potencia eléctrica (15/30/50 amperios para vehículos recreativos modernos), mapas de zonas inundables o franjas ribereñas, zonificación municipal y agrícola (CPTAQ) y el registro CITQ activo.'
      },
      {
        category: 'campings',
        q: '¿Cuál es el mejor momento del año para inspeccionar y adquirir un camping?',
        a: 'Aunque el cierre notarial suele programarse entre otoño y primavera para preparar la siguiente apertura, es muy recomendable inspeccionar bombas, acueducto, postes eléctricos, caminos y sanitarios en plena temporada operativa (mayo a octubre).'
      },
      {
        category: 'campings',
        q: '¿Qué condiciones de financiamiento y pago inicial son habituales para comprar un camping?',
        a: 'Los bancos y la BDC revisan tres años de estados financieros normalizados, la experiencia del comprador en gestión turística, el avalúo certificado y la vida útil de las redes subterráneas. Por lo general se requiere un pago inicial de entre el 25 % y el 35 %.'
      },
      {
        category: 'campings',
        q: '¿Se pueden añadir nuevas parcelas para VR o unidades ready-to-camp en un camping existente?',
        a: 'Ampliar parcelas o instalar cabañas, yurtas o minicasas nunca es automático: antes de pagar por terreno baldío, verifique derechos adquiridos frente a la zonificación vigente, permisos ambientales de tratamiento de aguas y eventuales restricciones agrícolas o ribereñas.'
      },
      {
        category: 'multilogement',
        q: '¿Cuál es la diferencia financiera y de valoración entre 2–4 unidades y edificios de 5 o más apartamentos?',
        a: 'Los edificios de 2 a 4 unidades (dúplex, tríplex, cuádruplex) se financian generalmente bajo criterios residenciales basados en ingresos personales y comparables de venta. A partir de 5 unidades, el financiamiento pasa a comercial: la valoración se rige ante todo por el Ingreso Operativo Neto (método de ingresos) y la cobertura de deuda (RCD).'
      },
      {
        category: 'multilogement',
        q: '¿Cómo funcionan la tasa de capitalización (Cap Rate / TGA) y el multiplicador de renta bruta (MRB)?',
        a: 'El MRB divide el precio por los ingresos brutos anuales para una comparación rápida que no refleja gastos. El Cap Rate o TGA divide el Ingreso Operativo Neto (NOI) entre el valor del inmueble (Valor = NOI / Cap Rate), siendo el parámetro clave para evaluadores, bancos e inversores institucionales desde 5 unidades.'
      },
      {
        category: 'multilogement',
        q: '¿Qué ventajas ofrece el financiamiento asegurado por la CMHC / SCHL (incluido APH Select)?',
        a: 'Para edificios de 5 o más unidades, el seguro CMHC (SCHL) brinda tasas más bajas, mayor relación préstamo-valor (menor enganche) y amortizaciones más largas que un crédito convencional. Con el programa APH Select, cumplir criterios de asequibilidad, eficiencia energética y accesibilidad permite amortizaciones de hasta 40 o 50 años.'
      },
      {
        category: 'multilogement',
        q: '¿Cómo inciden las normas del Tribunal administratif du logement (TAL) en las rentas y el valor?',
        a: 'En Quebec, los aumentos de alquiler siguen los criterios del TAL basados en impuestos, seguros, energía y obras mayores amortizadas. Los edificios terminados hace 5 años o menos pueden acogerse a una exención temporal de fijación (art. 1955 C.C.Q.) si consta en el contrato de arrendamiento.'
      },
      {
        category: 'multilogement',
        q: '¿Qué documentos e inspecciones técnicas revisar en la debida diligencia multifamiliar?',
        a: 'Se revisan todos los contratos de arrendamiento vigentes, historial de rentas cobradas, impuestos municipales y escolares, consumos de Hydro-Québec y gas, contratos de mantenimiento, facturas de obras mayores, certificado de localización actualizado y una inspección completa de estructura, techo, electricidad, plomería y análisis ambiental Fase I.'
      },
      {
        category: 'multilogement',
        q: '¿Por qué el valor económico bancario difiere a veces de los gastos declarados por el vendedor?',
        a: 'Aunque el propietario realice personalmente limpieza o remoción de nieve sin cobrar salario, el evaluador y el banco aplican gastos normalizados (administración, conserjería, reserva de mantenimiento mayor y tasa de vacancia normativa) para calcular el NOI real y el préstamo máximo.'
      },
      {
        category: 'multilogement',
        q: '¿Qué gastos de cierre e impuestos aplican al comprar un edificio multifamiliar en Quebec?',
        a: 'Debe presupuestar el impuesto municipal de transferencia inmobiliaria (impuesto de bienvenida), honorarios notariales, avalúo certificado e informes técnicos (Fase I ambiental, inspección, certificado de localización). Los alquileres residenciales a largo plazo están exentos de TPS/TVQ, salvo obra nueva o local comercial mixto.'
      }
    ]
  },
  links: {
    heading: 'Enlaces inmobiliarios y Red de socios',
    subtitle: 'Recursos gubernamentales oficiales y directorio de socios profesionales multidisciplinarios en Canadá y a nivel internacional.',
    govTitle: 'Portales informativos gubernamentales (Quebec y Canadá)',
    govLinks: [
      {
        name: 'Registraire des entreprises du Québec (Registro de Empresas)',
        desc: 'Identidad de personas jurídicas, administradores y matrícula corporativa en Quebec',
        url: 'https://www.quebec.ca/entreprises-et-travailleurs-autonomes/obtenir-renseignements-entreprise/recherche-registre-entreprises/acceder-registre-entreprises'
      },
      {
        name: 'Registre foncier du Québec (Registro de la Propiedad)',
        desc: 'Consulta oficial de transacciones y títulos de propiedad en Quebec',
        url: 'https://www.registrefoncier.gouv.qc.ca'
      },
      {
        name: 'Corporations Canada',
        desc: 'Sociedades de régimen federal y directorio corporativo canadiense',
        url: 'https://ised-isde.canada.ca/site/corporations-canada/fr'
      },
      {
        name: 'Directorio de Municipalidades de Quebec (MAMH)',
        desc: 'Avalúos e impuestos municipales, reglamentos municipales de zonificación',
        url: 'https://www.quebec.ca/gouvernement/portrait-quebec/repertoire-municipalites'
      },
      {
        name: 'Comisión de Protección del Territorio Agrícola de Quebec (CPTAQ)',
        desc: 'Zonificación agrícola, autorizaciones y cartografía del territorio',
        url: 'https://www.cptaq.gouv.qc.ca'
      },
      {
        name: 'Cartografía de zonas inundables (Géo-Inondations Québec)',
        desc: 'Atlas y mapas oficiales de zonas de inundación en Quebec',
        url: 'https://zonesinondables.mrnf.gouv.qc.ca/'
      },
      {
        name: 'Federación de Centros de Servicios Escolares / Impuestos escolares',
        desc: 'Directorio de centros de servicios y comisiones escolares de Quebec',
        url: 'https://www.fcssq.quebec'
      },
      {
        name: 'Directorio del Patrimonio Cultural de Quebec',
        desc: 'Inmuebles patrimoniales, sitios clasificados y áreas de protección',
        url: 'https://www.patrimoine-culturel.gouv.qc.ca'
      }
    ],
    partnersTitle: 'Socios multidisciplinarios (Canadá e Internacional)',
    partnerGroups: [
      {
        category: 'Abogados — Derecho comercial y Franquicias',
        items: [
          {
            name: 'FASKEN Abogados — Lic. Frédéric P. Gilbert, B.A., LL.B.',
            specialty: 'Agentes de patentes y marcas comerciales, Derecho de franquicias',
            address: 'Tour de la Bourse, 800 rue du Square-Victoria, oficina 3700, Montreal, QC H2Z 1E9',
            contact: '514-397-5232 • fgilbert@fasken.com',
            website: 'https://www.fasken.com/fr'
          },
          {
            name: 'Tutino Joseph Grégoire Abogados — Lic. Isabelle Grégoire',
            specialty: 'Vicios ocultos, franquicias y arrendamiento comercial',
            address: '1080, Côte du Beaver Hall, oficina 600, Montreal, QC H2Z 1S8',
            contact: '514-878-3878 • igregoire@tutinolex.com',
            website: 'https://tutinolex.com'
          },
          {
            name: 'GAO Avocat inc. — Lic. Yuan Znan Gao, LL.B., J.D., TEP',
            specialty: 'Derecho empresarial e inmobiliario',
            address: '6955, boul. Taschereau, suite 106, Brossard, QC J4Z 1A7',
            contact: '514-518-0880 • gao.avocat@gmail.com'
          }
        ]
      },
      {
        category: 'Agrimensores',
        items: [
          {
            name: 'Stéphan Roy, Agrimensor (Groupe SR)',
            specialty: 'Certificados de localización, amojonamiento y topografía legal',
            address: '255, boul. Curé-Labelle, oficina 100, Laval, QC H7L 2Z9',
            contact: '514-990-2333 • info@groupesr.ca',
            website: 'https://www.groupesr.ca'
          }
        ]
      },
      {
        category: 'Tasadores certificados (Cotos turísticos y Comercial)',
        items: [
          {
            name: 'André Leblanc et Ass. — Marc-André Leblanc, CMA, É.A.',
            specialty: 'Tasador certificado — Cotos turísticos (pourvoiries) y propiedades comerciales',
            address: '2965, rue de Boischatel, Trois-Rivières, QC G8Z 3Z8',
            contact: '819-373-6579 • maleblanc@aleblanc-ea.com',
            website: 'https://www.aleblanc-ea.com'
          },
          {
            name: 'Jean Philippe Baril, B.A.A., É.A., AACI, P.App. (Baril Évaluation)',
            specialty: 'Tasador certificado — Cotos turísticos y propiedades comerciales',
            address: '141, rue Bonaventure, Trois-Rivières, QC G9A 2A9',
            contact: '819-373-1401 / 1-866-373-1401 • info@barilevaluation.com',
            website: 'https://barilevaluation.com'
          }
        ]
      },
      {
        category: 'Servicios ambientales (Análisis de suelo y Fase I/II/III)',
        items: [
          {
            name: 'Physis Environnement Inc. — François Munger, Químico',
            specialty: 'Análisis ambiental de suelos y equipamiento',
            address: 'Montreal, Quebec',
            contact: '514-516-2255 • fmunger@physisenvironnement.com',
            website: 'https://www.physis.ca'
          },
          {
            name: 'MultiTEST — Krystel Segura, M.Sc., Vicepresidenta',
            specialty: 'Servicios ambientales y caracterización de terrenos',
            address: '464, boul. Roland-Therrien, Longueuil, QC J4H 3V9',
            contact: '514-990-2063 • info@multitest.ca',
            website: 'https://www.multitest.ca'
          }
        ]
      },
      {
        category: 'Consultores de Franquicias, Geomarketing y Diseño comercial',
        items: [
          {
            name: 'Imagine Franchise Consultant — Stéphane Breault, Presidente',
            specialty: 'Desarrollo y consultoría en franquicias',
            address: '1751, rue Richardson, oficina 4.509, Montreal, QC H3K 1G6',
            contact: '514-935-5686 ext. 229 • sbreault@imagine-fl.com',
            website: 'https://www.imaginefranchise.com'
          },
          {
            name: 'Indicia Géomarketing — Daniel Lemire, Presidente',
            specialty: 'Estudios de mercado y geomarketing comercial',
            address: '3467, boul. des Entreprises, suite 103, Terrebonne, QC J6X 4J9',
            contact: '450-477-3330 • daniel.lemire@indicia.ca',
            website: 'https://indicia.ca'
          },
          {
            name: 'DSD Groupe Design — Dimitri Smolens, APDIQ, DIC',
            specialty: 'Planificación de espacios comerciales y diseño de interiores',
            address: '2197, rue Sherbrooke Est, suite 010, Montreal, QC H2K 1C8',
            contact: '514-985-5320 • dsmolens@groupedesign.com',
            website: 'https://groupedesign.com'
          }
        ]
      },
      {
        category: 'Socios internacionales (República Dominicana)',
        items: [
          {
            name: 'República Dominicana — Wilfredo Mena & Asocs. / Revart',
            specialty: 'Arquitectura, construcción y supervisión de proyectos inmobiliarios',
            address: 'República Dominicana',
            contact: '809-788-0121 / 829-601-6745'
          }
        ]
      }
    ]
  }
};

ABOUT_CONTENT.ZH = {
  pageTitle: '关于我们',
  pageSubtitle: '自 2008 年以来，喜马拉雅地产集团（Immobilier Himalaya Real Estate Corp.）持续为魁北克、加拿大及全球客户提供卓越的房地产服务。',
  tabs: [
    { id: 'qui-nous-sommes', label: '公司简介' },
    { id: 'co-fondateurs', label: '联合创始人' },
    { id: 'services', label: '专业服务与行业协会' },
    { id: 'franchises', label: '连锁特许经营' },
    { id: 'carrieres', label: '招贤纳士与合作机构' },
    { id: 'faq', label: '常见问题 (FAQ)' },
    { id: 'liens', label: '房地产资源与合作伙伴' }
  ],
  whoWeAre: {
    heading: '关于喜马拉雅地产',
    intro:
      '自 2008 年创立以来，喜马拉雅地产（Immobilier Himalaya）已发展成为魁北克、加拿大乃至全球房地产领域的领军机构。来自各行各业的客户之所以信赖并选择我们，正是源于我们广泛的国际人脉网络、深厚的房地产交易专业知识、高度的诚信原则以及卓越的客户服务精神。我们团队的每一位成员都全力以赴为客户服务，在商业、住宅及工业地产领域提供丰富优质的出售与租赁物业选择。',
    profileTitle: '企业概况',
    profileParagraphs: [
      'Immobilier Himalaya Real Estate Corp. 是一家总部位于加拿大魁北克省的国际房地产经纪机构，专注于商业地产、工业地产及住宅投资物业经纪服务。',
      '我们汇聚了一支多元文化背景、诚信敬业的专业房地产经纪人团队，不懈努力地以最优方式满足客户的每一项需求。经纪人之所以选择加入喜马拉雅地产，是因为他们渴望攀登卓越的新高峰，并融入一个积极进取、追求卓越的高效团队。',
      '我们在遴选经纪人时，不仅看重其专业能力与从业经验，更重视其职业道德、诚信品质以及不断为客户寻求最佳解决方案的决心。',
      '对我们而言，与行业各方建立并保持长期稳固的合作关系至关重要。我们与商业空间使用方与管理方、房地产开发商、经纪同行、物业管理公司及各大金融机构均保持着良好的合作关系。'
    ],
    missionTitle: '企业使命',
    missionText:
      '促成公平诚信的房地产交易，建立长期稳固的专业合作关系，成为满足客户全方位需求的本地房地产智库，并提供强大的国际资源网络。',
    valuesTitle: '核心价值观',
    valuesList: ['协作', '沟通', '倾听', '尊重', '职业道德'],
    valuesText:
      '协作、沟通、倾听、尊重与职业道德是喜马拉雅地产的核心价值观，贯穿于我们的每一笔房地产交易之中。',
    contactCta: '欢迎联系我们：我们将非常乐意与您探讨您的房地产置业与投资项目！'
  },
  coFounders: {
    heading: '由充满热忱的专业人士领航的房地产机构',
    intro:
      '喜马拉雅地产（Immobilier Himalaya）由两位长期合作伙伴共同创立。自 1998 年相识以来，他们始终秉持着尊重、诚信、沟通与卓越的共同价值观。对于 Geniev Mondoux 与 Roger Rhéaume 而言，房地产不仅是一笔交易，更是建立深厚联结、凝聚人脉并助力客户实现人生与事业理想的重要契机。',
    founders: [
      {
        id: 'geniev-mondoux',
        name: 'Geniev Mondoux',
        role: '副总裁 — 特许房地产经纪人',
        credentials: 'CPA, MBA • 联合创始人兼机构行政总监',
        portrait: '/DATA/COURTIERINFOSUP/11_courtierGrand.JPG',
        photos: [
          '/DATA/CMSIMAGE/721.jpg',
          '/DATA/CMSIMAGE/722.jpg'
        ],
        paragraphs: [
          'Geniev Mondoux 重视家庭，将诚信与尊重奉为立身之本。他是特许专业会计师（CPA），拥有工商管理硕士学位（MBA），同时也是一位富有远见的企业家与机遇创造者。正是出于对人际交流与长久合作关系的热爱，他于 2008 年投身房地产行业。Geniev 对事业充满热忱，每天都从与客户的深入交流中汲取动力，全力以赴为客户提供无微不至的专业服务。他最大的优势在于敢于创新、善于提出切实可行的解决方案，从而推动各类复杂房地产交易顺利达成。此外，他出色的倾听能力、平易近人的亲和力，结合深厚的财务与地产专业经验，使他成为众多大型房地产项目中备受青睐的合作伙伴。',
          '作为喜马拉雅地产的联合创始人及集团旗下机构行政总监，Geniev 与长期合作伙伴 Roger Rhéaume 携手并进，出色地应对各种复杂挑战，始终能够找到切实有效的解决方案并取得最优成果。',
          '受深厚家庭价值观的感召，Geniev 在生活与工作的各个层面均坚守尊重与诚信原则。他为人热情开朗、风趣亲切，总能为客户与同事带来愉快融洽的合作氛围。'
        ]
      },
      {
        id: 'roger-rheaume',
        name: 'Roger Rhéaume',
        role: '总裁 — 特许房地产经纪人, DA',
        credentials: '联合创始人 • 前 OACIQ 董事会成员',
        portrait: '/DATA/COURTIERINFOSUP/99_courtierGrand.jpg',
        photos: [
          '/DATA/CMSIMAGE/200.jpg',
          '/DATA/CMSIMAGE/201.jpg',
          '/DATA/CMSIMAGE/202.jpg'
        ],
        sections: [
          {
            subtitle: '精彩人生 — “人生只有一次，我愿全力以赴活出精彩！”',
            paragraphs: [
              '从 18 岁起，我便开始徒步攀登高山并游历世界各国。高山对我而言象征着探索、宁静，以及力量与敬畏的源泉。在我 50 岁生日之际，我攀登至海拔 5,785 米的高度，亲眼瞻仰了坐落于世界最美山脉——喜马拉雅山脉之巅的珠穆朗玛峰。那是我送给自己最珍贵的 50 岁礼物！',
              '无论是欧洲、亚洲、非洲还是美洲的山脉，我都曾留下足迹，并深入了解当地人民的生活。在我眼中，世界广阔无垠且充满美好。50 多年来，我游历四方，领略地球的壮丽风光，感受不同民族的生活方式与文化习俗。我所拥有的最大财富便是爱与友谊。'
            ]
          },
          {
            subtitle: '对房地产事业的无限热忱',
            paragraphs: [
              '我早年在商业贸易与服务领域积累的丰富经验，引领我走向商业地产经纪行业。在积累了超过 20 年的商业与营销经验后，我与合伙人共同创立了喜马拉雅地产集团（Immobilier Himalaya Real Estate Corp.）。房地产是我毕生挚爱的事业。我曾担任魁北克房地产经纪自律监管机构（OACIQ）董事会成员 3 年，曾任魁北克房地产学院（Collège Immobilier du Québec）董事逾 5 年，并担任大蒙特利尔房地产董事会（CIGM）商业委员会主席超过 6 年。2022 年，我与合伙人 Fabien Herman 在墨西哥开设了房地产经纪办事处，协助魁北克与法国投资者购置海外物业；同时，我也与多米尼加共和国的房地产经纪机构建立了紧密的业务合作关系。',
              '出于对行业的热爱，我长期为房地产经纪人提供专业培训与专题讲座，助力同行提升专业素养。作为一名资深旅行家，我将事业与环球旅行完美结合，在多个国家积极开展房源代理与房地产开发项目。'
            ]
          }
        ]
      }
    ]
  },
  services: {
    heading: '以卓越品质著称的全方位房地产服务',
    intro1:
      '喜马拉雅地产（Immobilier Himalaya）是您各类房地产交易的理想合作伙伴。我们在多个国家的业务布局、深厚的专业造诣与实操经验，使我们能够以高度的专业精神指导客户推进房地产项目，并在商业、住宅及工业领域担任值得信赖的顾问。',
    intro2:
      '我们的团队为您提供全方位的房地产经纪服务。我们广博的市场知识与实战经验将转化为您的竞争优势，助您获得超越预期的理想成果。欢迎委托喜马拉雅房地产经纪人办理以下业务：',
    brokerageTitle: '商业及工业物业的出售、租赁与选址搜寻',
    brokerageItems: [
      '办公楼与商业铺位',
      '商业大厦与收益型物业',
      '多户住宅投资楼宇 (Multilogements)',
      '企业与生意转让',
      '狩猎垂钓度假庄园 (Pourvoiries) 与露营地',
      '酒店与旅游度假物业',
      '开发用地与土地储备',
      '连锁特许经营 (Franchises) 与牌照许可',
      '住宅投资物业的买卖与搜寻',
      '商业与工业地产项目开发'
    ],
    consultingTitle: '房地产专业顾问与咨询',
    advisoryTitle: '房地产专业顾问与咨询',
    consultingItems: [
      '客户需求分析与精准定位',
      '市场与行业板块深度调研',
      '项目机遇与潜在风险评估',
      '备选方案分析与优化建议',
      '配套专业服务（法律、税务、评估、环评）推荐',
      '商业及工业租约续签谈判',
      '公寓项目营销策划与推广',
      '国际买家与投资人网络精准对接'
    ],
    advisoryItems: [
      '客户需求分析与精准定位',
      '市场与行业板块深度调研',
      '项目机遇与潜在风险评估',
      '备选方案分析与优化建议',
      '配套专业服务（法律、税务、评估、环评）推荐',
      '商业及工业租约续签谈判',
      '公寓项目营销策划与推广',
      '国际买家与投资人网络精准对接'
    ],
    internationalTitle: '国际房地产经纪服务',
    internationalText:
      '为了更好地服务客户，我们在国际范围内建立了广泛的业务联系，并深入掌握多个国家的房地产市场动态。我们稳固可靠的国际人脉网络能够引导您把握全球优质房地产投资机遇。如需了解更多详情，欢迎随时与我们联系，我们将非常荣幸与您会面，共同探讨您的项目蓝图与投资愿景！',
    associationsTitle: '我们所属的行业协会',
    associationsText:
      '喜马拉雅地产是魁北克职业房地产经纪人协会（APCIQ）、魁北克特许经营理事会（CQF）、国际商业地产与零售协会（ICSC）、魁北克狩猎垂钓度假庄园联合会（FPQ）及魁北克露营地协会（Camping Québec）的正式成员。这使我们能够为在商业地产领域（尤其是度假庄园、露营地、商业零售及餐饮连锁行业）寻求出售、收购或租赁机会的客户提供最优质的专业服务。',
    associationsIntro:
      '喜马拉雅地产是 APCIQ、魁北克特许经营理事会（CQF）、ICSC、魁北克狩猎垂钓度假庄园联合会（FPQ）及 Camping Québec 的正式成员。',
    associationsBadges: [
      { code: 'OACIQ', name: '魁北克房地产经纪自律监管机构 (Organisme d’autoréglementation du courtage immobilier du Québec)' },
      { code: 'APCIQ', name: '魁北克职业房地产经纪人协会 (Association professionnelle des courtiers immobiliers du Québec)' },
      { code: 'FPQ', name: '魁北克狩猎垂钓度假庄园联合会 (Fédération des pourvoiries du Québec)' },
      { code: 'Camping Québec', name: '魁北克露营地协会 (Association des terrains de camping du Québec)' },
      { code: 'CQF', name: '魁北克特许经营理事会 (Conseil québécois de la franchise)' },
      { code: 'ICSC', name: '国际商业地产与零售协会 (International Council of Shopping Centers / ICSC)' }
    ],
    associations: [
      { code: 'OACIQ', name: '魁北克房地产经纪自律监管机构 (OACIQ)' },
      { code: 'APCIQ', name: '魁北克职业房地产经纪人协会 (APCIQ)' },
      { code: 'FPQ', name: '魁北克狩猎垂钓度假庄园联合会 (FPQ)' },
      { code: 'Camping Québec', name: '魁北克露营地协会 (Camping Québec)' },
      { code: 'CQF', name: '魁北克特许经营理事会 (CQF)' },
      { code: 'ICSC', name: '国际商业地产与零售协会 (ICSC)' }
    ]
  },
  careers: {
    brokerHeading: '成为喜马拉雅地产认证经纪人',
    brokerParagraphs: [
      '自 2008 年创立以来，Immobilier Himalaya Real Estate Corp. 已成为商业、工业和住宅房地产深厚专业知识的代名词。公司以诚实、守信和卓越的客户服务享誉业界，这些品质有力促进了团队协作、相互尊重与交易达成。',
      '加入我们成为房地产经纪人，您将充分受益于我们多年来积累的宝贵特权与高端人脉网络。您还将使用我们完善的专业工具，并融入一个互帮互助、紧密协作的精英团队。依托 Immobilier Himalaya Real Estate Corp. 的国际化平台，您将在本地及国际市场上脱颖而出。',
      '无论您是经验丰富的资深房地产经纪人，还是希望在商业与投资地产领域实现职业跃升，Immobilier Himalaya Real Estate Corp. 都热忱欢迎您的加入。'
    ],
    brokerBenefitsTitle: '喜马拉雅地产为经纪人提供的优势',
    brokerBenefits: [
      '每月定期的专业培训、研讨会与业务交流',
      '极具竞争力的低成本费用结构',
      '诚信敬业的高素质专业团队',
      '国际市场拓展网络与跨境业务机会',
      '多语言、多元文化官方网站展示',
      '多学科专家合作伙伴（律师、公证人、特许评估师、环境工程专家）',
      '蒙特利尔市中心尊贵品牌形象与办公地址（2000, av. McGill College）',
      '全天候在线虚拟办公室系统（企业邮箱、交易文档管理、资源共享等）'
    ],
    affiliateHeading: '成为顶尖房地产机构的国际合作加盟伙伴',
    affiliateParagraphs: [
      'Immobilier Himalaya Real Estate Corp. 在加拿大及国际房地产界享有卓越声誉。我们一流的服务水准、崇高的职业道德与专业精神，使我们成为您拓展业务的理想合作伙伴。',
      '成为我们机构的合作加盟伙伴（Affilié），您将共享我们的全国及国际资源网络，以及我们多年来通过严谨、诚信与不懈努力所积累的行业优势。协作与互助是我们企业哲学的核心，所有合作加盟机构均可获得全方位的运营支持。',
      '喜马拉雅地产希望与来自不同国家和文化背景的专业房地产经纪机构建立战略合作，共同推进全球化业务布局。'
    ],
    affiliateBenefitsTitle: '合作加盟机构尊享优势',
    affiliateBenefits: [
      '成熟的国际房地产资源网络',
      '多语言国际官方网站品牌曝光',
      '精简高效的合作成本结构',
      '诚信专业的总部支持团队',
      '蒙特利尔市中心尊贵企业形象与总部地址',
      '在线虚拟办公室系统支持（企业邮箱、文档协同、国际人脉对接等）'
    ],
    contactNote: '如需了解更多详情，欢迎联系 Geniev Mondoux 或 Roger Rhéaume。',
    applyBtn: '联系管理层 (Geniev Mondoux & Roger Rhéaume)'
  },
  faq: {
    heading: '常见问题解答 (FAQ) — 各大地产专业领域',
    subtitle: '全面解析魁北克商业与办公租赁、特许经营、狩猎垂钓度假庄园 (Pourvoiries)、露营地及多户公寓投资的核心实务问题。',
    categories: [
      { id: 'all', label: '全部问题' },
      { id: 'locations', label: '商业租赁' },
      { id: 'bureaux', label: '商业写字楼' },
      { id: 'franchises', label: '连锁特许经营' },
      { id: 'pourvoiries', label: '度假庄园 (Pourvoiries)' },
      { id: 'campings', label: '露营地 (Campings)' },
      { id: 'multilogement', label: '多户住宅公寓' }
    ],
    items: [
      {
        category: 'locations',
        q: '什么是“基本租金”（Loyer de base / Base Rent）？',
        a: '基本租金是根据所使用面积的平方英尺数及/或包含公共区域分摊在内的租赁空间所支付的租金部分，对应于该商业物业本身的房地产价值。'
      },
      {
        category: 'locations',
        q: '什么是“附加租金”（Loyer additionnel / Additional Rent）？',
        a: '附加租金是指租赁商铺及整栋建筑的运营与管理费用（包括电力、市政物业税、维护保养、建筑保险等），同样根据所占用的平方英尺数及包含公共区域的租赁空间比例进行分摊计算。'
      },
      {
        category: 'locations',
        q: '商业租金可以谈判吗？',
        a: '所有条款均可谈判：不仅基本租金和附加租金可以协商，装修免租期（安装期）以及租户装修补贴（Améliorations locatives）也都可以谈判。'
      },
      {
        category: 'locations',
        q: '应该签署短期租约还是长期租约？',
        a: '对于初创企业而言，租约期限应尽可能简短，以便在项目未达预期时将财务承担降至最低，尤其是在您需要为租约提供个人担保的情况下。对于成熟企业而言，五年及以上的长期租约更具优势，因为可以争取到更优惠的租金单价和租赁条件。'
      },
      {
        category: 'locations',
        q: '还有其他评估租约期限的方法吗？',
        a: '可以根据新租户在商铺装修与改良上的资金投入总额，以及这些装修投入需要摊销折旧的年限，来测算实现盈利所需的最短租约年限。'
      },
      {
        category: 'locations',
        q: '什么是“安装期 / 装修免租期”（Installation）？',
        a: '安装期是指房东给予租户用于安装经营设备、完成开业准备的时间段。通常情况下，房东会根据行业类型免费提供数周或数月的免租安装期（可涵盖基本租金及附加租金）。租户必须从进场安装的第一天起购买责任保险，以防范意外或灾害风险。'
      },
      {
        category: 'locations',
        q: '商业租户到期后是否自动享有留驻权？',
        a: '与住宅租约不同，商业租约的续租权必须从一开始就在合同中谈判确定。在租约中加入一项或多项续租选择权（Options de renouvellement）对租户至关重要，这既关乎企业的持续经营，也直接影响未来企业转让出售时的价值。'
      },
      {
        category: 'locations',
        q: '为什么要设立续租选择权（Option）？',
        a: '续租选择权之所以重要，是因为商业空间的装修投入高昂且地理位置具有战略意义。此外，我们还必须根据市场环境与竞争对手情况，为企业未来的潜在整体出售预留充足的租约保障。'
      },
      {
        category: 'locations',
        q: '续租选择权是一项强制义务吗？',
        a: '不是。续租选择权是一项预先谈判确定的权利，而非强制义务。我们所谈判的商业租约会明确规定：在租期届满前多少个月内，租户可以选择行使续租权，或者选择放弃并在租期结束时撤离。'
      },
      {
        category: 'locations',
        q: '我的房地产经纪人可以为我谈判商业租约吗？',
        a: '优秀的商业房地产经纪人能为您的企业带来巨大价值。您必须确保经纪人具备丰富的商业租约实战经验与专业知识，因为一份商业租约往往意味着房东与租户之间长达数年的重大法律与财务承诺！'
      },
      {
        category: 'locations',
        q: '魁北克有多少专门从事商业和工业地产的专业经纪人？',
        a: '在魁北克省约 17,000 名持牌房地产经纪人中，专门从事商业和工业地产的经纪人比例不足 6%。商业与工业地产领域与住宅地产截然不同：它并非满足个人居住需求，而是要解决复杂的企业经营与投资要求。'
      },
      {
        category: 'locations',
        q: '商业和工业地产合同与住宅合同一样吗？',
        a: '要完成工业厂房的出售或商业空间的租赁，绝不能像住宅交易那样简单填写标准表格。每个商业案例都独一无二，合同文件包含大量针对具体买卖或租赁类型量身定制的商法专属条款。'
      },
      {
        category: 'locations',
        q: '毛租（Brut）、半毛租（Semi-brut）与三净租约（Triple Net / NNN）有何区别？',
        a: '在毛租中，月租金已包含绝大多数运营开支（税费、保险、日常维护）；在半毛租中，租户通常自行承担电费、清洁或超出基准年的税费增幅；而在三净租约（NNN）中，租户除支付基本租金外，还按比例全额承担物业税、建筑保险及公共区域维护管理费（CAM）。'
      },
      {
        category: 'locations',
        q: '出售生意时，我可以转让商业租约（Cession de bail）或转租（Sous-location）吗？',
        a: '大多数商业租约允许在获得房东事先书面同意后进行租约转让或转租，且房东通常不得无正当理由拒绝。谈判初期即明确转让条件、避免高额手续费并约定原店主个人担保在合规转让后的解除条款至关重要。'
      },
      {
        category: 'locations',
        q: '商业租约中的排他性（非竞争 Exclusivité）条款有什么作用？',
        a: '在购物中心或多租户商业楼宇内，排他性条款限制房东将同一物业中的其他铺位出租给主营业务相同的直接竞争对手（例如第二家意式餐厅、咖啡馆或牙科诊所），从而保护您的稳定客流与未来生意转让价值。'
      },
      {
        category: 'locations',
        q: '商业租金是否需要缴纳联邦及魁省销售税（TPS/TVQ）及押金？',
        a: '是的。与住宅长租免税不同，商业零售、办公及工业物业租金（包含基本租金和附加租金）均需缴纳 TPS 与 TVQ。此外，房东通常要求相当于一个月至数个月含税总租金的履约保证金，并根据企业资信要求公司或个人担保。'
      },
      {
        category: 'bureaux',
        q: '写字楼租赁中，实际可用面积（Utilisable）与计租面积（Locative）有何区别？',
        a: '实际可用面积是指您的团队专属使用的办公与会议室面积；而计租面积（Rentable Area）则在此基础上按比例分摊了楼层及大厦公共区域（大堂、走廊、电梯厅、卫生间、设备房）的公摊系数（Load Factor）。比较不同写字楼报价时，必须结合公摊率换算实际每平方英尺使用成本。'
      },
      {
        category: 'bureaux',
        q: '什么是租户装修补贴（TI Allowance）和交钥匙精装交付（Turnkey）？',
        a: '房东可按每平方英尺给予一定金额的装修补贴（TI Allowance），用于隔断、玻璃墙、强弱电布线和地面装修；或由房东按双方确认的平面设计图完成“交钥匙”装修交付。补贴额度主要取决于租期长短、租户信用实力与商定的净租金水平。'
      },
      {
        category: 'bureaux',
        q: '如何在郊区或市中心写字楼谈判停车位及电动车充电桩配额？',
        a: '郊区办公楼通常按每 1,000 平方英尺配比一定数量的室外固定车位，而蒙特利尔市中心大厦的室内车位多按月另行计费。租约中应明确写入保证车位数量、访客停车政策、充电桩使用费率以及车位租金的年度涨幅上限。'
      },
      {
        category: 'bureaux',
        q: '承租写字楼时，空调供暖（HVAC）时段、电费与 24/7 门禁有何注意事项？',
        a: '写字楼中央空调通常在标准工作日时段（例如周一至周五 7:00 至 18:00）运行。若贵司团队常在夜间或周末办公，应提前确认非工作时段加班空调的按小时收费标准、24/7 门禁卡权限以及室内照明插座电费是否单独装表计费。'
      },
      {
        category: 'bureaux',
        q: 'A 级（Class A）、B 级和 C 级写字楼如何区分？',
        a: 'A 级写字楼地处核心地段，配备先进机电与高速电梯系统、绿色环保认证（LEED、BOMA BEST）与 24/7 安保，附加租金通常较高；B 级写字楼设施维护良好且性价比突出；C 级写字楼则适合注重成本控制的实用型企业。'
      },
      {
        category: 'bureaux',
        q: '什么是优先扩租权（ROFR / Option d’expansion），以及混合办公下如何灵活转租？',
        a: '对于处于成长期的企业，优先拒绝权（ROFR）约定当相邻单元腾空时，房东在出租给第三方前必须优先向您报价。配合灵活的部分转租条款，即便采用混合办公模式，企业也能随时按需扩减办公面积而无需搬迁。'
      },
      {
        category: 'franchises',
        q: '为何在开设或迁移连锁特许经营门店时应聘请 CQF 认证团队的商业经纪人？',
        a: '作为魁北克特许经营理事会（CQF）官方成员，喜马拉雅团队深谙特许总部、加盟商与物业房东之间的三方平衡。我们不仅发掘市中心与高流量商圈的非公开铺位，更协助评估坪效潜力并让商业租约与加盟合同保持无缝衔接。'
      },
      {
        category: 'franchises',
        q: '为什么特许经营总部通常要求审核租约并加入介入权（Step-in Right）条款？',
        a: '优质商业选址是连锁品牌的重要资产，因此总部往往要求租约须经其批准，并赋予总部在加盟商违约时的介入权（Step-in Right），以便由总部或指定新加盟商接管租约。从意向书（LOI）阶段即沟通此类条款可避免签约延误。'
      },
      {
        category: 'franchises',
        q: '餐饮类特许经营与零售/服务类特许经营在物业硬件上有何不同要求？',
        a: '餐饮加盟店必须核实电力容量与燃气供应、直通屋顶的商用排油烟管道、隔油池（Trappe à graisse）、后勤卸货通道及露台许可；零售或生活服务品牌则更关注沿街橱窗展示面、人流密度、停车便利度及户外塔牌/门头招牌曝光率。'
      },
      {
        category: 'franchises',
        q: '如何应对市政改建许可、露台许可与酒牌（RACJ）审批周期带来的风险？',
        a: '租约中应写入先决条件条款，保障分区用途确认、施工装修许可、招牌设置以及酒水牌照（RACJ）的顺利获批，同时争取将起租日（Commencement）与合理的施工免租安装期挂钩，避免未开业先付全额租金。'
      },
      {
        category: 'franchises',
        q: '收购一家现有盈利加盟店与开设全新连锁门店该如何抉择？',
        a: '收购成熟门店可直接获得经审计的历史营业额、全套现成厨具设备及稳定客群，但需仔细核查设备折旧、剩余租期、特许权使用费状态及总部要求翻新的成本；开设新店可打造最新品牌形象，但前期资本投入及爬坡期更长。'
      },
      {
        category: 'franchises',
        q: '品牌的区域保护范围（Exclusivité territoriale）与商业租约如何协调？',
        a: '特许经营合同通常划定特定地理半径或邮编保护区，防止同品牌内部恶性竞争。签租约前务必确认选址不与邻近加盟商保护区冲突，并确保租约总年限（首期加续租选项）覆盖特许经营合同的完整授权期限。'
      },
      {
        category: 'pourvoiries',
        q: '收购魁北克独家狩猎垂钓度假庄园（Pourvoirie）时，政府特许租约如何过户？',
        a: '在魁北克，拥有独家经营权的 Pourvoirie 依托省政府（MRNF / MELCCFP）颁发的独家狩猎与垂钓租约（Bail de droits exclusifs）运营。该公有土地租约不可像私人地块那样自动转让，买卖要约必须以获得省主管部门正式过户批文与执照核准为先决条件。'
      },
      {
        category: 'pourvoiries',
        q: '拥有独家领地权的庄园（Avec droits exclusifs）与非独家庄园（Sans droits exclusifs）有何差别？',
        a: '拥有独家权（Avec droits exclusifs）的 Pourvoirie 在划定的省属公有林地范围内享有狩猎、垂钓及捕捞的排他性商业经营权；非独家庄园则多位于私有土地或公共水域周边，无独家领地权，两者的估值方式、政府年费及过户审批程序均不相同。'
      },
      {
        category: 'pourvoiries',
        q: '交易价格中的木屋建筑、游船、舷外机、雪地车与设备应如何在合同中拆分？',
        a: 'Pourvoirie 交易通常同时涵盖不动产（私有土地、主楼、度假木屋）、无形经营权（政府独家租约、牌照、商誉与网站）以及大量动产设备清单（船只、马达、全地形车 ATV、雪地摩托、发电机、家具布草）。合理严谨的资产拆分直接决定银行融资额度、过户欢迎税及 TPS/TVQ 税务处理。'
      },
      {
        category: 'pourvoiries',
        q: '购买 Pourvoirie 前必须重点检查哪些环境与技术设施？',
        a: '尽职调查重点包括化粪池系统环保合规性（Q-2, r. 22 法规）、饮用水过滤与水质检测、汽油/柴油/丙烷储罐及土壤污染隐患、独立供电能力（太阳能、发电机或高压电网接入）以及码头、水坝或林区涵洞的完好度。'
      },
      {
        category: 'pourvoiries',
        q: '在魁北克收购 Pourvoirie 如何申请融资，为何必须聘请专业特许评估师？',
        a: '传统商业银行若缺乏行业经验往往较少直接批贷。商业银行、BDC 或区域性金融机构通常要求较高的首付比例（根据动产与经营权占比，常见为 25% 至 40% 或以上）、近三年财务报表、完整商业计划书以及由熟悉度假庄园领域的魁省特许评估师（É.A.）出具的正式估值报告。'
      },
      {
        category: 'pourvoiries',
        q: '林区公路直达与水上飞机（Hydravion）可达对运营成本和盈利有何影响？',
        a: '公路直达的 Pourvoirie 能吸引更多家庭自驾游客与四季客流，但需分摊多用途林区道路及桥梁的维护费用；仅限水上飞机进入的庄园定位稀缺高端，客单价更高，但物资补给依赖航空运输与严格的季节运营规划。'
      },
      {
        category: 'pourvoiries',
        q: '新业主接手后需续期或转名的旅游住宿许可（CITQ）及野生动物申报有哪些？',
        a: '经营者必须确保持有有效的魁北克旅游住宿登记编号（CITQ）、Pourvoirie 经营许可、餐厅及酒牌（若设主楼餐饮）以及法定的渔猎收获登记报表。作为魁北克庄园联合会（FPQ）成员，喜马拉雅全程协助买卖双方顺利完成所有手续。'
      },
      {
        category: 'campings',
        q: '为何“常驻季租营位”（Saisonniers）与“短途旅客营位”（Voyageurs）的比例会直接影响露营地估值？',
        a: '季租营位能在开季前提前收回稳定的年度租金，显著降低夏季阴雨天气对现金流的冲击；短租旅客营位与高端露营木屋（Prêts-à-camper）则拥有更高的单晚收益率，但需要更多营销与接待管理。均衡的客源结构最受贷款机构青睐。'
      },
      {
        category: 'campings',
        q: '魁北克露营地（Camping）的合理市场估值是如何计算的（EBITDA 与土地价值）？',
        a: '露营地的商业估值主要以其标准化运营利润（EBITDA / 税息折旧前净营业收入）乘以同业市场倍数计算，同时结合地块自身的土地资产价值（占地面积、湖岸或河岸线长度、未来扩建空间）与近年基建更新情况综合评定。'
      },
      {
        category: 'campings',
        q: '购买露营地前哪些市政法规与基础设施检查绝不可遗漏？',
        a: '务必核查饮用水源井与供水管网、化粪池及污水处理系统是否满足全部两通/三通营位的实际负荷；检查现代房车（VR）所需的电力配电容量（15/30/50 安培）；核对防洪区与滨水保护带界线、市政及农业保护区划（CPTAQ）以及有效的 CITQ 注册号。'
      },
      {
        category: 'campings',
        q: '考察、验房以及完成露营地过户交割的最佳季节是什么时候？',
        a: '虽然产权过户常安排在秋末至次年早春以便新业主筹备新季开业，但水泵系统、地下供排水管网、配电柱、内部道路和卫浴设施的实地技术检验强烈建议在 5 月至 10 月营业旺季期间完成。'
      },
      {
        category: 'campings',
        q: '购买露营地时通常有哪些融资渠道，首付需要多少？',
        a: '商业银行及 BDC 会审核过去三年的标准化财务报表、买家的文旅运营经验、特许评估报告及地下管网使用寿命。视项目规模及是否包含业主自住住宅，常规商业首付要求通常在 25% 至 35% 之间。'
      },
      {
        category: 'campings',
        q: '在现有露营地上增设房车营位或豪华露营小屋（Prêts-à-camper）是否可行？',
        a: '任何扩建均非自动获准：在为未开发林地支付溢价之前，必须核实既有合法权（Droits acquis）与现行市政区划法规、省级废水处理排放许可及农业或滨水限制，确认具备合规扩建条件。'
      },
      {
        category: 'multilogement',
        q: '2 至 4 户物业（Plex）与 5 户及以上多户公寓楼在贷款与估值上有何根本区别？',
        a: '2 至 4 户（Duplex、Triplex、Quadruplex）通常属于住宅贷款范畴，主要依据买家个人收入资信及周边同类成交比较法（Comparables）定价；从 5 户及以上起则进入商业多户地产范畴，估值完全由净营业收入（收益法）与银行债务覆盖率（RCD / DCR）决定。'
      },
      {
        category: 'multilogement',
        q: '什么是资本化率（TGA / Cap Rate）与毛租金倍数（MRB / GRM）？',
        a: '毛租金倍数（MRB）是以挂牌价除以年总租金收入，适合对同区位类似物业进行初步横向筛查，但未体现运营开支差异；而资本化率（TGA / Cap Rate）则以净营业收入（RNE / NOI）除以物业价格，是评估师、机构买家与商业银行衡量 5 户以上楼宇真实回报的核心基准。'
      },
      {
        category: 'multilogement',
        q: '加拿大按揭及房屋公司（SCHL / CMHC）保险贷款及 APH Select 计划有何优势？',
        a: '针对 5 户及以上公寓楼，SCHL 商业贷款保险可带来更低的利率、更高的贷款成数（更低首付）和更长的摊销年限。若项目满足 APH Select 计划的可负担租金、节能减排或无障碍通行积分标准，最高可争取长达 40 至 50 年的摊销期以大幅优化现金流。'
      },
      {
        category: 'multilogement',
        q: '魁北克住房行政法庭（TAL）的法规如何影响租金调整与公寓估值？',
        a: '魁省住宅租约续签及涨租须遵循 TAL 计算标准，主要参考地税、保险、能源开支增幅及重大资本修缮分摊。落成 5 年或以内的新建出租物业若在租约中依法载明相关条款（《魁北克民法典》第 1955 条），则可享有临时租金定价豁免，这是收购分析中的关键核查项。'
      },
      {
        category: 'multilogement',
        q: '多户收益型物业的尽职调查需要核查哪些文件与建筑硬件？',
        a: '完整调查涵盖所有现行租约与续约通知、实收租金台账、市政与学校税单、Hydro-Québec 及燃气能耗账单、除雪/电梯等维护合同、重大修缮发票、最新物业位置图（Certificat de localisation），以及屋顶、砖墙砌体、上下水管路、配电盘、地基与第一阶段环境评估（Phase I）的全面检验。'
      },
      {
        category: 'multilogement',
        q: '为何银行测算的物业经济价值有时会低于卖方账面净收入？',
        a: '即使原业主亲自承担除雪、清洁或日常维修而未计提人工工资，商业银行与特许评估师在核定融资时仍会统一套用“标准化运营开支”（管理费、保洁、大修储备金及市场标准空置率），以客观核算净营业收入（NOI）并避免高估最高可贷额度。'
      },
      {
        category: 'multilogement',
        q: '在魁北克购买多户住宅楼时，除了首付外还需预算哪些交割税费与报告开支？',
        a: '买家应预留市政房产转让税（俗称欢迎税 Taxe de bienvenue）、公证师费用、特许商业评估报告以及通常在 5 户以上交易中银行要求的环境报告（Phase I）、专业验楼报告及位置测绘费用。长期住宅租金免征 TPS/TVQ，但若包含一楼商铺（商住混合）或属于全新完工建筑则需由公证师及税务专家核定具体税负。'
      }
    ]
  },
  links: {
    heading: '房地产权威链接与合作伙伴网络',
    subtitle: '魁北克与加拿大官方政府资源目录，以及我们在加拿大和国际上的多学科专业合作伙伴名录。',
    govTitle: '政府官方信息门户（魁北克与加拿大）',
    govLinks: [
      {
        name: '魁北克企业注册处 (Registraire des entreprises du Québec)',
        desc: '查询魁北克法人实体身份、公司董事及企业注册登记信息',
        url: 'https://www.quebec.ca/entreprises-et-travailleurs-autonomes/obtenir-renseignements-entreprise/recherche-registre-entreprises/acceder-registre-entreprises'
      },
      {
        name: '魁北克土地注册处 (Registre foncier du Québec)',
        desc: '官方查询魁北克不动产交易记录、产权契约及抵押登记',
        url: 'https://www.registrefoncier.gouv.qc.ca'
      },
      {
        name: '加拿大联邦企业局 (Corporations Canada)',
        desc: '加拿大联邦注册公司查询及全国企业名录',
        url: 'https://ised-isde.canada.ca/site/corporations-canada/en'
      },
      {
        name: '魁北克市政名录 (MAMH)',
        desc: '市政物业估值、市政地产税及各市分区规划法规查询',
        url: 'https://www.quebec.ca/gouvernement/portrait-quebec/repertoire-municipalites'
      },
      {
        name: '魁北克农业用地保护委员会 (CPTAQ)',
        desc: '农业用地区划、非农用途审批及土地地图查询',
        url: 'https://www.cptaq.gouv.qc.ca'
      },
      {
        name: '洪水风险区官方地图 (Géo-Inondations Québec)',
        desc: '魁北克省水文图集及洪泛区官方测绘地图',
        url: 'https://zonesinondables.mrnf.gouv.qc.ca/'
      },
      {
        name: '魁北克学校服务中心联合会 / 学校税查询',
        desc: '魁北克各学区服务中心及学校税征收名录',
        url: 'https://www.fcssq.quebec'
      },
      {
        name: '魁北克文化遗产名录 (Répertoire du patrimoine culturel)',
        desc: '历史保护建筑、文物古迹及文化保护区查询',
        url: 'https://www.patrimoine-culturel.gouv.qc.ca'
      }
    ],
    partnersTitle: '多学科专业合作伙伴（加拿大及国际）',
    partnerGroups: [
      {
        category: '商业法与特许经营律师 (Avocats)',
        items: [
          {
            name: 'FASKEN 律师事务所 — Frédéric P. Gilbert 律师, B.A., LL.B.',
            specialty: '专利与商标代理人、特许经营法与商业法专家',
            address: 'Tour de la Bourse, 800 rue du Square-Victoria, bureau 3700, Montréal, QC H2Z 1E9',
            contact: '514-397-5232 • fgilbert@fasken.com',
            website: 'https://www.fasken.com/en'
          },
          {
            name: 'Tutino Joseph Grégoire 律师事务所 — Isabelle Grégoire 律师',
            specialty: '隐蔽瑕疵诉讼、连锁特许经营及商业租约法律事务',
            address: '1080, Côte du Beaver Hall, bureau 600, Montréal, QC H2Z 1S8',
            contact: '514-878-3878 • igregoire@tutinolex.com',
            website: 'https://tutinolex.com'
          },
          {
            name: 'GAO Avocat inc. — 高远瞻律师 (Me Yuan Znan Gao, LL.B., J.D., TEP)',
            specialty: '商业法、公司法与房地产法律事务',
            address: '6955, boul. Taschereau, suite 106, Brossard, QC J4Z 1A7',
            contact: '514-518-0880 • gao.avocat@gmail.com'
          }
        ]
      },
      {
        category: '土地测量师 (Arpenteurs-géomètres)',
        items: [
          {
            name: 'Stéphan Roy 土地测量师 (Groupe SR)',
            specialty: '物业位置证明书 (Certificat de localisation)、界桩测绘与土地勘测',
            address: '255, boul. Curé-Labelle, bureau 100, Laval, QC H7L 2Z9',
            contact: '514-990-2333 • info@groupesr.ca',
            website: 'https://www.groupesr.ca'
          }
        ]
      },
      {
        category: '特许房地产评估师（度假庄园及商业物业）',
        items: [
          {
            name: 'André Leblanc et Ass. — Marc-André Leblanc, CMA, É.A.',
            specialty: '特许评估师 — 狩猎垂钓度假庄园 (Pourvoiries) 及商业物业估值',
            address: '2965, rue de Boischatel, Trois-Rivières, QC G8Z 3Z8',
            contact: '819-373-6579 • maleblanc@aleblanc-ea.com',
            website: 'https://www.aleblanc-ea.com'
          },
          {
            name: 'Jean Philippe Baril, B.A.A., É.A., AACI, P.App. (Baril Évaluation)',
            specialty: '特许评估师 — 度假庄园及商业地产评估',
            address: '141, rue Bonaventure, Trois-Rivières, QC G9A 2A9',
            contact: '819-373-1401 / 1-866-373-1401 • info@barilevaluation.com',
            website: 'https://barilevaluation.com'
          }
        ]
      },
      {
        category: '环境工程服务（土壤分析及环境评估 Phase I/II/III）',
        items: [
          {
            name: 'Physis Environnement Inc. — François Munger, 化学师',
            specialty: '土壤环境分析与场地检测设备',
            address: 'Montréal, Québec',
            contact: '514-516-2255 • fmunger@physisenvironnement.com',
            website: 'https://www.physis.ca'
          },
          {
            name: 'MultiTEST — Krystel Segura, M.Sc., 副总裁',
            specialty: '场地环境评估与土壤特性表征服务',
            address: '464, boul. Roland-Therrien, Longueuil, QC J4H 3V9',
            contact: '514-990-2063 • info@multitest.ca',
            website: 'https://www.multitest.ca'
          }
        ]
      },
      {
        category: '特许经营顾问、地理营销与商业空间设计',
        items: [
          {
            name: 'Imagine Franchise Consultant — Stéphane Breault, 总裁',
            specialty: '连锁特许经营网络开发与战略咨询',
            address: '1751, rue Richardson, bureau 4.509, Montréal, QC H3K 1G6',
            contact: '514-935-5686 poste 229 • sbreault@imagine-fl.com',
            website: 'https://www.imaginefranchise.com'
          },
          {
            name: 'Indicia Géomarketing — Daniel Lemire, 总裁',
            specialty: '商业市场调研与地理营销分析 (Géomarketing)',
            address: '3467, boul. des Entreprises, suite 103, Terrebonne, QC J6X 4J9',
            contact: '450-477-3330 • daniel.lemire@indicia.ca',
            website: 'https://indicia.ca'
          },
          {
            name: 'DSD Groupe Design — Dimitri Smolens, APDIQ, DIC',
            specialty: '商业空间规划与室内设计服务',
            address: '2197, rue Sherbrooke Est, suite 010, Montréal, QC H2K 1C8',
            contact: '514-985-5320 • dsmolens@groupedesign.com',
            website: 'https://groupedesign.com'
          }
        ]
      },
      {
        category: '国际合作伙伴（多米尼加共和国）',
        items: [
          {
            name: '多米尼加共和国 — Wilfredo Mena & Asocs. / Revart',
            specialty: '建筑设计、工程施工与房地产项目监理',
            address: 'République Dominicaine',
            contact: '809-788-0121 / 829-601-6745'
          }
        ]
      }
    ]
  }
};
