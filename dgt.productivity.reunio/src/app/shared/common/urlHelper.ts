/**
 * MAnipulate url string data
 *
 * @export
 */
export class UrlHelper {
  /**
   * Tests if a url param exists
   *
   * @param name The name of the url parameter to check
   */
    public static urlParamExists(name: string): boolean {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    return regex.test(location.search);
  }

  /**
   * Gets a url param value by name
   *
   * @param name The name of the parameter for which we want the value
   */
  public static getUrlParamByName(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * REturn true if a term in in the url hostname
   *
   */
  public static isInHostHeader(name: string): boolean {
    return window.location.hostname.includes(name);
  }

  public static generateGuid() {
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c: any) =>
// tslint:disable-next-line: no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  public static formatUrl(title: string): string {
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().split(" ").join("_").replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
  }

}

