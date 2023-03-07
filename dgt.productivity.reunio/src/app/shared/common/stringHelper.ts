/**
 * MAnipulate url string data
 *
 * @export
 */
export class StringHelper {
  public static nameInitialGenerator(data: any) {
    if (data) {
          return data.split(' ').map((item: any) => {
      if (item.charAt(0).match(/[a-z]/i)) {
        return item.charAt(0);
      } else {
        return '';
      }
    }).join('');
    }
  }

  public static formatSliderLabel(value: number | null) {
    if (!value) { return 0; }
    if (value <= 1) { return (value) * 100 + 'Mo'; }
    return (value - 1) + 'Go';
  }
}

