#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

// Aqui vai a classe que resolvemos
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mapa;
        for (int i = 0; i < nums.size(); i++) {
            int complemento = target - nums[i];
            if (mapa.count(complemento)) {
                return {mapa[complemento], i};
            }
            mapa[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> numeros = {2, 7, 11, 15};
    int alvo = 9;

    vector<int> resultado = sol.twoSum(numeros, alvo);

    cout << "Indices: [" << resultado[0] << ", " << resultado[1] << "]" << endl;

    return 0;
}