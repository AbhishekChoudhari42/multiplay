export const generateZigzag = (size: number): number[] => {
    let total = size * size;
    let matrix: number[] = [];
    let leftToRight = true;
  
    for (let row = 0; row < size; row++) {
      let currentRow: number[] = new Array(size);
      for (let col = 0; col < size; col++) {
        let index = leftToRight ? col : (size - 1 - col);
        currentRow[index] = total--;
      }
      matrix.push(...currentRow);
      leftToRight = !leftToRight; // Toggle direction
    }
  
    return matrix;
  };

export const postionMap = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0']