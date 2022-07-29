import csv
import json
import random
import uuid
from re import search

def userCheck(id, name, ingredients):
  print(id, name, ingredients)
  res = input('Accept? y/n: ')
  return res == "y"

# Open the csv file object
with open('C:/Users/ds185503/Downloads/dataset/dataset/full_dataset.csv','r',encoding='utf-8') as f:
  with open("recipes.txt", "w") as wf:
    with open("catalog.json", "w") as wfCatalog:
      catalog = []
      items = dict()
      # Construct the csv reader object from the file object
      reader = csv.reader(f)
      for row in reader:
        chance = random.random()
        # 0.9999 for 250 recipes
        if(chance > 0.99999):
          name = row[1].replace(",", "").replace("-","")
          # format for recipe.txt
          # ingredientName-ingredientID,ingredient2Name-ingredient2ID...,RecipeName
          ingredients = [thing.lower().replace(",", "").replace("-","") for thing in row[6][2:-2].split('\", \"')]
          
          if not userCheck(row[0], name, ingredients):
            continue

          # wf.writelines([name + '-' + uid + ',' for name in ingredients])
          # wf.write(name + '\n')

          #available depends on chance
          for ingredient in ingredients:
            uid = hex(random.randint(0, 4294967295))[2:]
            if ingredient in items:
              uid = items[ingredient]
              wf.write(ingredient + '-' + items[ingredient] + ',')
            else:
              items[ingredient] = uid
              wf.write(ingredient + '-' + items[ingredient] + ',')
              jsonIngredient = {
                "version": 101,
                "status": "ACTIVE",
                "dynamicAttributes": [
                  {
                    "type": "retail-item",
                    "attributes": [
                      {
                        "key": "ITEM_TYPE_CODE",
                        "value": "0"
                      }
                    ]
                  }
                ],
                "packageIdentifiers": [{ "type": "0", "value": uid }],
                "departmentId": "02",
                "itemId": {
                  "itemCode": uid
                },
                "merchandiseCategory": { "nodeId": "6532adcd" },
                "shortDescription": {
                  "values": [
                    {
                      "locale": "en-US",
                      "value": ingredient
                    }
                  ]
                },
                "longDescription": {
                  "values": [
                    {
                      "locale": "en-US",
                      "value": "Long Description"
                    }
                  ]
                },
                "unitOfMeasure": "EA",
                "price": "0.99",
                "currency": "USD",
                "effectiveDate": "2020-12-17T05:00:00Z",
                "imageUrl": "",
                "groups": "28ba8df5",
                "nonMerchandise": False
              }
              catalog.append(jsonIngredient)
          wf.write(name + '\n')
      jsonCatalog = json.dumps(catalog, indent=4)
      wfCatalog.writelines(jsonCatalog)  

