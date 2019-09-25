/*
 * Gli alias di tipo creano un nuovo nome per un tipo. 
 * Gli alias di tipo a volte sono simili alle interfacce, 
 * ma possono indicare primitive, unions, 
 * tuple e tutti gli altri tipi che altrimenti dovrebbero scrivere manualmente.
 * L'aliasing non crea in realtà un nuovo tipo: crea un nuovo nome per fare riferimento a tale tipo. 
 * L'aliasing di un primitivo non è praticamente utile, anche se può essere utilizzato come una forma di documentazione. 
 * Interfaces vs. Type Aliases
 * Una seconda differenza più importante è che gli alias di tipo non possono essere estesi o implementati da 
 * (né possono estendere / implementare altri tipi). 
 * Poiché una proprietà ideale del software è aperta all'estensione, 
 * è sempre necessario utilizzare un'interfaccia su un alias di tipo, se possibile.
 * 
 **/

export type ResponseServer = {
    result: boolean;
    data: any;
    message: string;
}