# Handleiding
## Hoe start je het project op?
Om het project op te starten moet je Node geïnstalleerd hebben en dan voer je het volgende commando in de terminal uit:
```shell script
npm run dev
```

## Back-end:
Hierin wordt alle logica van de REST API geïmplementeerd. Er zijn routes naar de verschillende
resources te vinden, zoals 'auctions' en 'users'. De keuze om geen aparte resource te gebruiken voor
de bids lag aan het feit dat biedingen geen zinvol bestaansrecht hebben. Dus om een bod uit te brengen
wordt er een POST request verstuurd naar de '/api/auctions/:auctionId/bids'. Hiermee wordt het bod ook 
aan de biedingenlijst van de betreffende gebruiker toegevoegd. Daarnaast wordt het verwijderen van een
bod bereikt door een DELETE request te versturen naar '/api/users/:username/bids/:bidId'. Hiermee wordt 
het bod ook uit de betreffende veiling verwijderd.

## Front-end:
### Componenten structuur:
In de /src/routes directory zijn alle Svelte componenten te vinden, die ervoor zorgen dat de 
front-end aan de requirements voldoet. In dit geval is er één Svelte component nodig voor elke
pagina. De componenten zijn op deze manier opgedeeld, omdat het vorige project ook deze structuur 
had. Het verschil met het vorige project is dat nu alle elementen van de pagina (html, css en JavaScript)
in één bestand zitten. Dit heeft als voordeel dat de componenten makkelijker aangepast kunnen worden en 
dingen die bij elkaar horen bij elkaar staan. Een ander voordeel van svelte is dat alle componenten in dit
project gebruik kunnen maken van een gemeenschappelijk component, namelijk de Nav.svelte component.

### Communicatie met de back-end:
dus er zijn meerdere bestanden die dezelfde resources van de API benaderen. Echter,
er worden niet altijd dezelfde requests verstuurd naar de API. Bijvoorbeeld: De veilingen kunnen
zowel via de admin.svelte pagina als via de index.svelte pagina opgevraagd worden, maar
veilingen kunnen alleen toegevoegd/ verwijderd/ gewijzigd worden via de admin.svelte pagina.
Daarnaast zijn sommige pagina's niet toegankelijk voor alle gebruikers, zoals de users.svelte pagina
en de admin.svelte pagina. Deze pagina's zijn alleen zichtbaar voor accounts die de 'admin'
rol hebben. Als een 'gewone' gebruiker een van deze pagina's probeert te bereiken, wordt er een
foutmelding (UNAUTHORIZED) teruggestuurd.

## Inloggegevens:
De inloggegevens voor de twee accounts zijn:
- admin:
    - username: vini
    - wachtwoord: wachtwoord123
    
- gewone gebruiker:
    - username: joyce
    - wachtwoord: wachtwoord321